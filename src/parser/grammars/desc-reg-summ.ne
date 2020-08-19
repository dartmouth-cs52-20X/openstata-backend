@{%

// replaces a few stata syntax things to python
function cleanExpression(string) {
	return string
		.replace(/(!|~)(?![=])/g, ' not ')
		.replace(/~/g, '!')
		.replace(/\^/g, '**')
}

// boilerplate for interleaving infrastructure
function composeWhitespace(wsArray) {
	return {
		input: wsArray[0].join(''),
		parsed: null,
	};
}

// kind of pointless, an abstraction
function composeUsingFunction(input, appliedFunc) {
	return {
		input,
		parsed: appliedFunc(input),
	};
}

// this is honestly pointless but yay abstraction?
function simpleCompose(input, parsed) {
	return {
		input,
		parsed,
	};
}

// can take arrays of arrays to join properly
function composeFromRaw(rawinput) {
	return rawinput.map((items) => {
		if (Array.isArray(items)) {
			return items.map((item) => {
				return item.input;
			}).join('');
		} else {
			return items;	
		}
	}).join('');
}

// can take an array of some raw text and some that are already parsed
function composeManyInputs(inputArray) {
	return inputArray.map((items) => {
		if (items.input || items.input === '') {
			return items.input
		} else {
			return items;	
		}
	}).join('');
}

// puts together a reg statement
function composeRegression([yvar, xArray, cond]) {
	const condString = cond ? `\'${cond}\'` : 'None';
	const xvars = `[${xArray.map((xvar) => `'${xvar}'`).join()}]`
	return `regress('${yvar}', ${xvars}, ${condString})`
}

function composeSummarize([vars, cond]) {
	const condString = cond ? `\'${cond}\'` : 'None';
	const varString = `[${vars.map((avar) => `'${avar}'`).join()}]`
	return `summarize(${varString}, ${condString})`;
}

function composeDescribe([vars]) {
	const varString = `[${vars.map((avar) => `'${avar}'`).join()}]`
	return `describe(${varString})`;
}

%}

program -> ___ command (newl command):* ___ {% (data) => {
	const [,command, otherCommands] = data;
	const input = [command.input];
	const parsed = [command.parsed];
	otherCommands.map((commandSet) => commandSet[1])
		.forEach((nextCommand) => {
			input.push(nextCommand.input);
			parsed.push(nextCommand.parsed);
		});
	return simpleCompose(input, parsed);
}%}

# the first grammar instruction is the 'main' top-level instruction
# this implementation only does single line commands
command -> _ regression {% (data) => {
	const { input, parsed } = data[1];
	return simpleCompose(input, composeRegression(parsed));
}%}
		| _ summarize {% (data) => {
	const { input, parsed } = data[1];
	return simpleCompose(input, composeSummarize(parsed));
}%}
		| _ describe {% (data) => {
	const { input, parsed } = data[1];
	return simpleCompose(input, composeDescribe(parsed));
}%}
		| "test" # more rules can just be tacked on with a pipe char

# pipe since regression can happen either with or w/o an if condition
regression ->  _regression __ condition {% (data) => {
					const [reg,_, cond] = data;
					const input = composeManyInputs(data);
					const parsed = reg.parsed.concat(cond.parsed);
					return simpleCompose(input, parsed);
				} %}
			|  _regression _ {% id %}

# actual reg syntax here
_regression -> "reg" __ var multivar {% (data) => {
	const [,, yvar, xArray] = data;
	const input = composeManyInputs(data);
	const parsed = [yvar.parsed, xArray.parsed];
	return simpleCompose(input, parsed);
}%}

summarize -> _summarize __ condition  {% (data) => {
					const [summ,_, cond] = data;
					const input = composeManyInputs(data);
					const parsed = summ.parsed.concat(cond.parsed);
					return simpleCompose(input, parsed);
				} %}
		   | _summarize _ {% id %}

_summarize -> _summ multivar {% (data) => {
	const [, varArray] = data;
	const input = composeManyInputs(data);
	return simpleCompose(input, [varArray.parsed]);
}%}
		| _summ  {% (data) => {
	const input = composeManyInputs(data);
	return simpleCompose(input, [[]]);	
}%}

_summ -> "summ" | "summarize"

# potental multiple indep vars
multivar -> (__ var):+ null {% (data) => {
	const rawinput = data[0];
	const input = composeFromRaw(rawinput);
	const parsed = rawinput.map((item) => { 
		return item[1].parsed;
	});
	return simpleCompose(input, parsed);
}%}

describe -> _describe _ {% id %}

_describe -> _desc multivar {% (data) => {
	const [, varArray] = data;
	const input = composeManyInputs(data);
	return simpleCompose(input, [varArray.parsed]);
}%}
		| _desc {% (data) => {
	const input = composeManyInputs(data);
	return simpleCompose(input, [[]]);	
}%}

_desc -> "desc" | "describe"

# single var
var -> [\w]:+ {% (data, _, reject) => {
	const input = data[0].join('');
	if (input === 'if') return reject;
	return simpleCompose(input, input);
}%}

# if statement's form
condition -> "if" __ exp {% (data) => {
	const input = data[0] + data[1].input + data[2].input;
	const parsed = data[2].parsed;
	return simpleCompose(input, parsed);
}%}

# directly translates a condition to python without parsing, using regex
exp -> [\S] .:* null {% (data, _, reject) => {
	const input = data[0] + data[1].join('');
	if (input.includes('if')) return reject;
	return composeUsingFunction(input, cleanExpression);
}%}

# Whitespace
_ -> [ \t]:* {% composeWhitespace %}
__ -> [ \t]:+ {% composeWhitespace %}
___ -> [\n\r]:* {% composeWhitespace %}
newl -> [\n\r]:+ {% composeWhitespace %}

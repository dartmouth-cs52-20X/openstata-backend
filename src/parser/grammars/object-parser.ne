####### BASIC STATA PARSER #######


####### STRUCTURE #######

program -> ___b _ command (newl _ command):* _ ___a {% (data) => {
	const [,,command, otherCommands] = data;
	const input = [command.input];
	const parsed = [command.parsed];
	otherCommands.map((commandSet) => commandSet[2])
		.forEach((nextCommand) => {
			input.push(nextCommand.input);
			parsed.push(nextCommand.parsed);
		});
	return simpleCompose(input, parsed);
}%}


####### COMMAND PROCESSING #######

# the first grammar instruction is the 'main' top-level instruction
# this implementation only does single line commands
command -> regression {% (data) => {
	const { input, parsed } = data[0];
	return simpleCompose(input, composeRegression(parsed));
}%}
		| summarize {% (data) => {
	const { input, parsed } = data[0];
	return simpleCompose(input, composeSummarize(parsed));
}%}
		| describe {% (data) => {
	const { input, parsed } = data[0];
	return simpleCompose(input, composeDescribe(parsed));
}%}
		| generate {% (data) => {
	const { input, parsed } = data[0];
	return simpleCompose(input, composeGenerate(parsed));
}%}
		| clear {% (data) => { 
	return simpleCompose(data[0], composeClear()); 
} %}
		| use {% (data) => {
	const { input, parsed } = data[0];
	return simpleCompose(input, composeUse(parsed));
}%}
		| "test" # more rules can just be tacked on with a pipe char


####### REGRESS #######

# pipe since regression can happen either with or w/o an if condition
regression ->  _regression __ condition {% (data) => {
					const [reg,_, cond] = data;
					const input = composeManyInputs(data);
					const parsed = reg.parsed.concat(cond.parsed);
					return simpleCompose(input, parsed);
				} %}
			|  _regression {% id %}

# actual reg syntax here
_regression -> "reg" __ var multivar {% (data) => {
	const [,, yvar, xArray] = data;
	const input = composeManyInputs(data);
	const parsed = [yvar.parsed, xArray.parsed];
	return simpleCompose(input, parsed);
}%}


####### SUMMARIZE #######

summarize -> _summarize __ condition  {% (data) => {
					const [summ,_, cond] = data;
					const input = composeManyInputs(data);
					const parsed = summ.parsed.concat(cond.parsed);
					return simpleCompose(input, parsed);
				} %}
		   | _summarize {% id %}

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


####### GENERATE #######

generate -> _generate __ condition {% (data) => {
					const [gen,_, cond] = data;
					const input = composeManyInputs(data);
					const parsed = gen.parsed.concat(cond.parsed);
					return simpleCompose(input, parsed);
				} %}
		| _generate {% id %}

_generate -> _gen __ var __ "=" __ exp {% (data) => {
	const [,,varName,,,,exp] = data;
	const input = composeManyInputs(data);
	return simpleCompose(input, [varName.parsed, exp.parsed]);
} %}

_gen -> "gen"



####### DESCRIBE #######

describe -> _describe {% id %}

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


####### CLEAR #######

clear -> "clear"


####### USE #######

use -> "use" __ url {% (data) => {
	const url = data[2]
	const input = composeManyInputs(data);
	return simpleCompose(input, [url]);
} %}

url -> [\S]:+ {% (data) => data[0].join('') %}


####### BASIC SYNTAX #######

# potental multiple indep vars
multivar -> (__ var):+ null {% (data) => {
	const rawinput = data[0];
	const input = composeFromRaw(rawinput);
	const parsed = rawinput.map((item) => { 
		return item[1].parsed;
	});
	return simpleCompose(input, parsed);
}%}

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
exp -> [\S]:+ (__ [\S]:+):* {% (data, _, reject) => {
	const [term1, otherterms] = data;
	const input = term1.join('') + otherterms.map((termexp) => {
		return termexp[0].input + termexp[1].join('');
	}).join('');
	if (input.includes('if')) return reject;
	return composeUsingFunction(input, cleanExpression);
}%}


####### PRIMITIVES #######

# Whitespace
_ -> [ \t]:* {% composeWhitespace %}
__ -> [ \t]:+ {% composeWhitespace %}
___b -> (_ [\n\r]):* {% composeWhitespace %}
___a -> ([\n\r] _):* {% composeWhitespace %}
newl -> (_ [\n\r]):+ {% composeWhitespace %}


####### POSTPROCESSOR LIBRARY #######
@{%

// replaces a few stata syntax things to python
function cleanExpression(string) {
	return string
		.replace(/~/g, '!')
		.replace(/(!|~)(?![=])/g, '~')
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

function composeParsed(command, args, condition, options) {
	return {
		command: command || null,
		args: args || null,
		condition: condition || null,
		options: options || null
	};
};

// puts together a reg statement
function composeRegression([yvar, xArray, condition]) {
	return composeParsed('regress', [yvar, xArray], condition);
}

function composeSummarize([vars, condition]) {
	return composeParsed('summarize', vars, condition);
}

function composeDescribe([vars]) {
	return composeParsed('describe', vars);
}

function composeGenerate([varname, exp, condition]) {
	return composeParsed('generate', [varname, exp], condition);
}

function composeClear() {
	return composeParsed('clear');
}

function composeUse(args) {
	return composeParsed('use', args);
}

%}

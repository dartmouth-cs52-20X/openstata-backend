/* eslint-disable */
// Generated automatically by nearley, version 2.19.5
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }


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
		if (items.input) {
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

var grammar = {
    Lexer: undefined,
    ParserRules: [
    {"name": "program$ebnf$1", "symbols": []},
    {"name": "program$ebnf$1$subexpression$1", "symbols": ["newl", "command"]},
    {"name": "program$ebnf$1", "symbols": ["program$ebnf$1", "program$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "program", "symbols": ["command", "program$ebnf$1"], "postprocess":  (data) => {
        	const [command, otherCommands] = data;
        	const input = [command.input];
        	const parsed = [command.parsed];
        	otherCommands.map((commandSet) => commandSet[1])
        		.forEach((nextCommand) => {
        			input.push(nextCommand.input);
        			parsed.push(nextCommand.parsed);
        		});
        	return simpleCompose(input, parsed);
        }},
    {"name": "command", "symbols": ["_", "regression"], "postprocess":  (data) => {
        	const { input, parsed } = data[1];
        	return simpleCompose(input, composeRegression(parsed));
        }},
    {"name": "command$string$1", "symbols": [{"literal":"t"}, {"literal":"e"}, {"literal":"s"}, {"literal":"t"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "command", "symbols": ["command$string$1"]},
    {"name": "regression", "symbols": ["_regression", "__", "condition"], "postprocess":  (data) => {
        	const [reg,_, cond] = data;
        	const input = composeManyInputs(data);
        	const parsed = reg.parsed.concat(cond.parsed);
        	return simpleCompose(input, parsed);
        } },
    {"name": "regression", "symbols": ["_regression", "_"], "postprocess": id},
    {"name": "_regression$string$1", "symbols": [{"literal":"r"}, {"literal":"e"}, {"literal":"g"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "_regression", "symbols": ["_regression$string$1", "__", "var", "multivar"], "postprocess":  (data) => {
        	const [,, yvar, xArray] = data;
        	const input = composeManyInputs(data);
        	const parsed = [yvar.parsed, xArray.parsed];
        	return simpleCompose(input, parsed);
        }},
    {"name": "multivar$ebnf$1$subexpression$1", "symbols": ["__", "var"]},
    {"name": "multivar$ebnf$1", "symbols": ["multivar$ebnf$1$subexpression$1"]},
    {"name": "multivar$ebnf$1$subexpression$2", "symbols": ["__", "var"]},
    {"name": "multivar$ebnf$1", "symbols": ["multivar$ebnf$1", "multivar$ebnf$1$subexpression$2"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "multivar", "symbols": ["multivar$ebnf$1"], "postprocess":  (data) => {
        	const rawinput = data[0];
        	const input = composeFromRaw(rawinput);
        	const parsed = rawinput.map((item) => { 
        		return item[1].parsed;
        	});
        	return simpleCompose(input, parsed);
        }},
    {"name": "var$ebnf$1", "symbols": [/[\w]/]},
    {"name": "var$ebnf$1", "symbols": ["var$ebnf$1", /[\w]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "var", "symbols": ["var$ebnf$1"], "postprocess":  (data, _, reject) => {
        	const input = data[0].join('');
        	if (input === 'if') return reject;
        	return simpleCompose(input, input);
        }},
    {"name": "condition$string$1", "symbols": [{"literal":"i"}, {"literal":"f"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "condition", "symbols": ["condition$string$1", "__", "exp"], "postprocess":  (data) => {
        	const input = data[0] + data[1].input + data[2].input;
        	const parsed = data[2].parsed;
        	return simpleCompose(input, parsed);
        }},
    {"name": "exp$ebnf$1", "symbols": []},
    {"name": "exp$ebnf$1", "symbols": ["exp$ebnf$1", /./], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "exp", "symbols": [/[\S]/, "exp$ebnf$1"], "postprocess":  (data, _, reject) => {
        	const input = data[0] + data[1].join('');
        	if (input.includes('if')) return reject;
        	return composeUsingFunction(input, cleanExpression);
        }},
    {"name": "_$ebnf$1", "symbols": []},
    {"name": "_$ebnf$1", "symbols": ["_$ebnf$1", /[ \t]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "_", "symbols": ["_$ebnf$1"], "postprocess": composeWhitespace},
    {"name": "__$ebnf$1", "symbols": [/[ \t]/]},
    {"name": "__$ebnf$1", "symbols": ["__$ebnf$1", /[ \t]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "__", "symbols": ["__$ebnf$1"], "postprocess": composeWhitespace},
    {"name": "___$ebnf$1", "symbols": []},
    {"name": "___$ebnf$1", "symbols": ["___$ebnf$1", /[\s]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "___", "symbols": ["___$ebnf$1"], "postprocess": composeWhitespace},
    {"name": "newl$ebnf$1", "symbols": []},
    {"name": "newl$ebnf$1", "symbols": ["newl$ebnf$1", /[\n\r]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "newl", "symbols": ["newl$ebnf$1"], "postprocess": composeWhitespace}
]
  , ParserStart: "program"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();

// Generated automatically by nearley, version 2.19.5
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }


function composeClear() {
	return composeParsed('clear');
}

function composeUse(args) {
	return composeParsed('use', args);
}

function composeSummarize([vars, condition]) {
	return composeParsed('summarize', vars, condition);
}

function composeDescribe([vars]) {
	return composeParsed('describe', vars);
}

function composeMean([vars, condition]) {
	return composeParsed('mean', vars, condition);
}


function composeGenerate([varname, exp, condition]) {
	return composeParsed('generate', [varname, exp], condition);
}


function composeRegression([yvar, xArray, condition]) {
	return composeParsed('regress', [yvar, xArray], condition);
}


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

// formats the parsed object, inserting nulls where needed
function composeParsed(command, args, condition, options) {
	return {
		command: command || null,
		args: args || null,
		condition: condition || null,
		options: options || null
	};
};

var grammar = {
    Lexer: undefined,
    ParserRules: [
    {"name": "program$ebnf$1", "symbols": []},
    {"name": "program$ebnf$1$subexpression$1", "symbols": ["newl", "_", "command"]},
    {"name": "program$ebnf$1", "symbols": ["program$ebnf$1", "program$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "program", "symbols": ["___b", "_", "command", "program$ebnf$1", "_", "___a"], "postprocess":  (data) => {
        	const [,,command, otherCommands] = data;
        	const input = [command.input];
        	const parsed = [command.parsed];
        	otherCommands.map((commandSet) => commandSet[2])
        		.forEach((nextCommand) => {
        			input.push(nextCommand.input);
        			parsed.push(nextCommand.parsed);
        		});
        	return simpleCompose(input, parsed);
        }},
    {"name": "command", "symbols": ["clear"], "postprocess":  (data) => {
        	return simpleCompose(data[0], composeClear());
        } },
    {"name": "command", "symbols": ["use"], "postprocess":  (data) => {
        	const { input, parsed } = data[0];
        	return simpleCompose(input, composeUse(parsed));
        } },
    {"name": "command", "symbols": ["summarize"], "postprocess":  (data) => {
        	const { input, parsed } = data[0];
        	return simpleCompose(input, composeSummarize(parsed));
        } },
    {"name": "command", "symbols": ["describe"], "postprocess":  (data) => {
        	const { input, parsed } = data[0];
        	return simpleCompose(input, composeDescribe(parsed));
        } },
    {"name": "command", "symbols": ["mean"], "postprocess":  (data) => {
        	const { input, parsed } = data[0];
        	return simpleCompose(input, composeMean(parsed));
        } },
    {"name": "command", "symbols": ["generate"], "postprocess":  (data) => {
        	const { input, parsed } = data[0];
        	return simpleCompose(input, composeGenerate(parsed));
        } },
    {"name": "command", "symbols": ["regression"], "postprocess":  (data) => {
        	const { input, parsed } = data[0];
        	return simpleCompose(input, composeRegression(parsed));
        } },
    {"name": "command$string$1", "symbols": [{"literal":"t"}, {"literal":"e"}, {"literal":"s"}, {"literal":"t"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "command", "symbols": ["command$string$1"]},
    {"name": "clear$string$1", "symbols": [{"literal":"c"}, {"literal":"l"}, {"literal":"e"}, {"literal":"a"}, {"literal":"r"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "clear", "symbols": ["clear$string$1"], "postprocess": id},
    {"name": "use", "symbols": ["_use", "__", "url"], "postprocess":  (data) => {
        	const url = data[2]
        	const input = composeManyInputs(data);
        	return simpleCompose(input, [url]);
        } },
    {"name": "url$ebnf$1", "symbols": [/[\S]/]},
    {"name": "url$ebnf$1", "symbols": ["url$ebnf$1", /[\S]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "url", "symbols": ["url$ebnf$1"], "postprocess": (data) => data[0].join('')},
    {"name": "_use", "symbols": [{"literal":"u"}]},
    {"name": "_use$string$1", "symbols": [{"literal":"u"}, {"literal":"s"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "_use", "symbols": ["_use$string$1"]},
    {"name": "_use$string$2", "symbols": [{"literal":"u"}, {"literal":"s"}, {"literal":"e"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "_use", "symbols": ["_use$string$2"]},
    {"name": "summarize", "symbols": ["_summarize", "__", "condition"], "postprocess":  (data) => {
        	const [summ,_, cond] = data;
        	const input = composeManyInputs(data);
        	const parsed = summ.parsed.concat(cond.parsed);
        	return simpleCompose(input, parsed);
        } },
    {"name": "summarize", "symbols": ["_summarize"], "postprocess": id},
    {"name": "_summarize", "symbols": ["_summ", "multivar"], "postprocess":  (data) => {
        	const [, varArray] = data;
        	const input = composeManyInputs(data);
        	return simpleCompose(input, [varArray.parsed]);
        }},
    {"name": "_summarize", "symbols": ["_summ"], "postprocess":  (data) => {
        	const input = composeManyInputs(data);
        	return simpleCompose(input, [[]]);
        }},
    {"name": "_summ", "symbols": [{"literal":"s"}]},
    {"name": "_summ$string$1", "symbols": [{"literal":"s"}, {"literal":"u"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "_summ", "symbols": ["_summ$string$1"]},
    {"name": "_summ$string$2", "symbols": [{"literal":"s"}, {"literal":"u"}, {"literal":"m"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "_summ", "symbols": ["_summ$string$2"]},
    {"name": "_summ$string$3", "symbols": [{"literal":"s"}, {"literal":"u"}, {"literal":"m"}, {"literal":"m"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "_summ", "symbols": ["_summ$string$3"]},
    {"name": "_summ$string$4", "symbols": [{"literal":"s"}, {"literal":"u"}, {"literal":"m"}, {"literal":"m"}, {"literal":"a"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "_summ", "symbols": ["_summ$string$4"]},
    {"name": "_summ$string$5", "symbols": [{"literal":"s"}, {"literal":"u"}, {"literal":"m"}, {"literal":"m"}, {"literal":"a"}, {"literal":"r"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "_summ", "symbols": ["_summ$string$5"]},
    {"name": "_summ$string$6", "symbols": [{"literal":"s"}, {"literal":"u"}, {"literal":"m"}, {"literal":"m"}, {"literal":"a"}, {"literal":"r"}, {"literal":"i"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "_summ", "symbols": ["_summ$string$6"]},
    {"name": "_summ$string$7", "symbols": [{"literal":"s"}, {"literal":"u"}, {"literal":"m"}, {"literal":"m"}, {"literal":"a"}, {"literal":"r"}, {"literal":"i"}, {"literal":"z"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "_summ", "symbols": ["_summ$string$7"]},
    {"name": "_summ$string$8", "symbols": [{"literal":"s"}, {"literal":"u"}, {"literal":"m"}, {"literal":"m"}, {"literal":"a"}, {"literal":"r"}, {"literal":"i"}, {"literal":"z"}, {"literal":"e"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "_summ", "symbols": ["_summ$string$8"]},
    {"name": "describe", "symbols": ["_describe"], "postprocess": id},
    {"name": "_describe", "symbols": ["_desc", "multivar"], "postprocess":  (data) => {
        	const [, varArray] = data;
        	const input = composeManyInputs(data);
        	return simpleCompose(input, [varArray.parsed]);
        }},
    {"name": "_describe", "symbols": ["_desc"], "postprocess":  (data) => {
        	const input = composeManyInputs(data);
        	return simpleCompose(input, [[]]);
        }},
    {"name": "_desc", "symbols": [{"literal":"d"}]},
    {"name": "_desc$string$1", "symbols": [{"literal":"d"}, {"literal":"e"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "_desc", "symbols": ["_desc$string$1"]},
    {"name": "_desc$string$2", "symbols": [{"literal":"d"}, {"literal":"e"}, {"literal":"s"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "_desc", "symbols": ["_desc$string$2"]},
    {"name": "_desc$string$3", "symbols": [{"literal":"d"}, {"literal":"e"}, {"literal":"s"}, {"literal":"c"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "_desc", "symbols": ["_desc$string$3"]},
    {"name": "_desc$string$4", "symbols": [{"literal":"d"}, {"literal":"e"}, {"literal":"s"}, {"literal":"c"}, {"literal":"r"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "_desc", "symbols": ["_desc$string$4"]},
    {"name": "_desc$string$5", "symbols": [{"literal":"d"}, {"literal":"e"}, {"literal":"s"}, {"literal":"c"}, {"literal":"r"}, {"literal":"i"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "_desc", "symbols": ["_desc$string$5"]},
    {"name": "_desc$string$6", "symbols": [{"literal":"d"}, {"literal":"e"}, {"literal":"s"}, {"literal":"c"}, {"literal":"r"}, {"literal":"i"}, {"literal":"b"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "_desc", "symbols": ["_desc$string$6"]},
    {"name": "_desc$string$7", "symbols": [{"literal":"d"}, {"literal":"e"}, {"literal":"s"}, {"literal":"c"}, {"literal":"r"}, {"literal":"i"}, {"literal":"b"}, {"literal":"e"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "_desc", "symbols": ["_desc$string$7"]},
    {"name": "mean", "symbols": ["_mean", "__", "condition"], "postprocess":  (data) => {
        	const [mean,_, cond] = data;
        	const input = composeManyInputs(data);
        	const parsed = mean.parsed.concat(cond.parsed);
        	return simpleCompose(input, parsed);
        } },
    {"name": "mean", "symbols": ["_mean"], "postprocess": id},
    {"name": "_mean", "symbols": ["_me", "multivar"], "postprocess":  (data) => {
        	const [, varArray] = data;
        	const input = composeManyInputs(data);
        	return simpleCompose(input, [varArray.parsed]);
        }},
    {"name": "_mean", "symbols": ["_me"], "postprocess":  (data) => {
        	const input = composeManyInputs(data);
        	return simpleCompose(input, [[]]);
        }},
    {"name": "_me$string$1", "symbols": [{"literal":"m"}, {"literal":"e"}, {"literal":"a"}, {"literal":"n"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "_me", "symbols": ["_me$string$1"]},
    {"name": "generate", "symbols": ["_generate", "__", "condition"], "postprocess":  (data) => {
        	const [gen,_, cond] = data;
        	const input = composeManyInputs(data);
        	const parsed = gen.parsed.concat(cond.parsed);
        	return simpleCompose(input, parsed);
        } },
    {"name": "generate", "symbols": ["_generate"], "postprocess": id},
    {"name": "_generate", "symbols": ["_gen", "__", "var", "__", {"literal":"="}, "__", "exp"], "postprocess":  (data) => {
        	const [,,varName,,,,exp] = data;
        	const input = composeManyInputs(data);
        	return simpleCompose(input, [varName.parsed, exp.parsed]);
        } },
    {"name": "_gen$string$1", "symbols": [{"literal":"g"}, {"literal":"e"}, {"literal":"n"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "_gen", "symbols": ["_gen$string$1"]},
    {"name": "regression", "symbols": ["_regression", "__", "condition"], "postprocess":  (data) => {
        	const [reg,_, cond] = data;
        	const input = composeManyInputs(data);
        	const parsed = reg.parsed.concat(cond.parsed);
        	return simpleCompose(input, parsed);
        } },
    {"name": "regression", "symbols": ["_regression"], "postprocess": id},
    {"name": "_regression", "symbols": ["_reg", "__", "var", "multivar"], "postprocess":  (data) => {
        	const [,, yvar, xArray] = data;
        	const input = composeManyInputs(data);
        	const parsed = [yvar.parsed, xArray.parsed];
        	return simpleCompose(input, parsed);
        }},
    {"name": "_reg$string$1", "symbols": [{"literal":"r"}, {"literal":"e"}, {"literal":"g"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "_reg", "symbols": ["_reg$string$1"]},
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
    {"name": "exp$ebnf$1", "symbols": [/[\S]/]},
    {"name": "exp$ebnf$1", "symbols": ["exp$ebnf$1", /[\S]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "exp$ebnf$2", "symbols": []},
    {"name": "exp$ebnf$2$subexpression$1$ebnf$1", "symbols": [/[\S]/]},
    {"name": "exp$ebnf$2$subexpression$1$ebnf$1", "symbols": ["exp$ebnf$2$subexpression$1$ebnf$1", /[\S]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "exp$ebnf$2$subexpression$1", "symbols": ["__", "exp$ebnf$2$subexpression$1$ebnf$1"]},
    {"name": "exp$ebnf$2", "symbols": ["exp$ebnf$2", "exp$ebnf$2$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "exp", "symbols": ["exp$ebnf$1", "exp$ebnf$2"], "postprocess":  (data, _, reject) => {
        	const [term1, otherterms] = data;
        	const input = term1.join('') + otherterms.map((termexp) => {
        		return termexp[0].input + termexp[1].join('');
        	}).join('');
        	if (input.includes('if')) return reject;
        	return composeUsingFunction(input, cleanExpression);
        }},
    {"name": "_$ebnf$1", "symbols": []},
    {"name": "_$ebnf$1", "symbols": ["_$ebnf$1", /[ \t]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "_", "symbols": ["_$ebnf$1"], "postprocess": composeWhitespace},
    {"name": "__$ebnf$1", "symbols": [/[ \t]/]},
    {"name": "__$ebnf$1", "symbols": ["__$ebnf$1", /[ \t]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "__", "symbols": ["__$ebnf$1"], "postprocess": composeWhitespace},
    {"name": "___b$ebnf$1", "symbols": []},
    {"name": "___b$ebnf$1$subexpression$1", "symbols": ["_", /[\n\r]/]},
    {"name": "___b$ebnf$1", "symbols": ["___b$ebnf$1", "___b$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "___b", "symbols": ["___b$ebnf$1"], "postprocess": composeWhitespace},
    {"name": "___a$ebnf$1", "symbols": []},
    {"name": "___a$ebnf$1$subexpression$1", "symbols": [/[\n\r]/, "_"]},
    {"name": "___a$ebnf$1", "symbols": ["___a$ebnf$1", "___a$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "___a", "symbols": ["___a$ebnf$1"], "postprocess": composeWhitespace},
    {"name": "newl$ebnf$1$subexpression$1", "symbols": ["_", /[\n\r]/]},
    {"name": "newl$ebnf$1", "symbols": ["newl$ebnf$1$subexpression$1"]},
    {"name": "newl$ebnf$1$subexpression$2", "symbols": ["_", /[\n\r]/]},
    {"name": "newl$ebnf$1", "symbols": ["newl$ebnf$1", "newl$ebnf$1$subexpression$2"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
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

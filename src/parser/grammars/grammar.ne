####### BASIC STATA PARSER #######


####### STRUCTURE #######

program -> ___b _ command (newl _ command):* _ ___a {% (data) => {
	const [,,command, otherCommands] = data;
	const output = [command.parsed];
	output[0].input = command.input;
	otherCommands.map((commandSet) => commandSet[2])
		.forEach((nextCommand) => {
			const newCommand = nextCommand.parsed;
			newCommand.input = nextCommand.input;
			output.push(newCommand);
		});
	return output;
}%}


####### COMMAND PROCESSING #######

# the first grammar instruction is the 'main' top-level instruction
# this implementation only does single line commands
command ->
	clear {% (data) => {
		return simpleCompose(data[0], composeClear());
	} %} |
	use {% (data) => {
		const { input, parsed } = data[0];
		return simpleCompose(input, composeUse(parsed));
	} %} |
	summarize {% (data) => {
		const { input, parsed } = data[0];
		return simpleCompose(input, composeSummarize(parsed));
	} %} |
	describe {% (data) => {
		const { input, parsed } = data[0];
		return simpleCompose(input, composeDescribe(parsed));
	} %} |
	mean {% (data) => {
		const { input, parsed } = data[0];
		return simpleCompose(input, composeMean(parsed));
	} %} |

	generate {% (data) => {
		const { input, parsed } = data[0];
		return simpleCompose(input, composeGenerate(parsed));
	} %} |
	replace {% (data) => {
		const { input, parsed } = data[0];
		return simpleCompose(input, composeReplace(parsed));
	} %} |
	rename {% (data) => {
		const { input, parsed } = data[0];
		return simpleCompose(input, composeRename(parsed));
	} %} |
	drop {% (data) => {
		const { input, parsed } = data[0];
		return simpleCompose(input, composeDrop(parsed));
	} %} |
	keep {% (data) => {
		const { input, parsed } = data[0];
		return simpleCompose(input, composeKeep(parsed));
	} %} |

	merge {% (data) => {
		const { input, parsed } = data[0];
		return simpleCompose(input, composeMerge(parsed));
	} %} |
	regression {% (data) => {
		const { input, parsed } = data[0];
		return simpleCompose(input, composeRegression(parsed));
	} %} |
	predict {% (data) => {
		const { input, parsed } = data[0];
		return simpleCompose(input, composePredict(parsed));
	} %} |
	test {% (data) => {
		const { input, parsed } = data[0];
		return simpleCompose(input, composeTest(parsed));
	} %} |

	"asdf" # more rules can just be tacked on with a pipe char


####### MACROS #######

# name: the actual option name
option[name] -> $name {% (data) => {
	const [opt] = data;
	const option = Array.isArray(opt[0]) ? opt[0][0] : opt[0];
	return simpleCompose(option, { option, arg: null });
} %}

# option w/ one var argument
optionArgs[name] -> $name "(" _ var  _ ")" {% (data) => {
	const [opt,,,argument] = data;
	const input = composeManyInputs(data);
	const option = Array.isArray(opt[0]) ? opt[0][0] : opt[0];
	return simpleCompose(input, { option, arg: argument.parsed });
} %}


####### CLEAR #######

clear -> "clear" {% id %}


####### USE #######

use ->
	_use __ fname {% (data) => {
		const fname = data[2]
		const input = composeManyInputs(data);
		return simpleCompose(input, [fname]);
	} %}

_use -> "u" | "us" | "use"


####### SUMMARIZE #######

summarize ->
	_summarize __ condition  {% (data) => {
		const [summ,, cond] = data;
		const input = composeManyInputs(data);
		const parsed = summ.parsed.concat(cond.parsed);
		return simpleCompose(input, parsed);
	} %} |
	_summarize {% id %}

_summarize ->
	_summ multivar {% (data) => {
		const [, varArray] = data;
		const input = composeManyInputs(data);
		return simpleCompose(input, [varArray.parsed]);
	}%} |
	_summ  {% (data) => {
		const input = composeManyInputs(data);
		return simpleCompose(input, [[]]);
	}%}

_summ -> "s" | "su" | "sum" | "summ" | "summa" | "summar" | "summari" | "summariz" | "summarize"


####### DESCRIBE #######

describe -> _describe {% id %}

_describe ->
	_desc multivar {% (data) => {
		const [, varArray] = data;
		const input = composeManyInputs(data);
		return simpleCompose(input, [varArray.parsed]);
	}%} |
	_desc {% (data) => {
		const input = composeManyInputs(data);
		return simpleCompose(input, [[]]);
	}%}

_desc -> "d" | "de" | "des" | "desc" | "descr" | "descri" | "describ" | "describe"


####### MEAN #######

mean ->
	_mean __ condition  {% (data) => {
		const [mean,, cond] = data;
		const input = composeManyInputs(data);
		const parsed = mean.parsed.concat(cond.parsed);
		return simpleCompose(input, parsed);
	} %} |
	_mean {% id %}

_mean ->
	_me multivar {% (data) => {
		const [, varArray] = data;
		const input = composeManyInputs(data);
		return simpleCompose(input, [varArray.parsed]);
	}%}

_me -> "mean"









####### GENERATE #######

generate ->
	_generate __ condition {% (data) => {
		const [gen,, cond] = data;
		const input = composeManyInputs(data);
		const parsed = gen.parsed.concat(cond.parsed);
		return simpleCompose(input, parsed);
	} %} |
	_generate {% id %}

_generate ->
	_gen __ var _ "=" _ exp {% (data) => {
		const [,,varName,,,,exp] = data;
		const input = composeManyInputs(data);
		return simpleCompose(input, [varName.parsed, exp.parsed]);
	} %}

_gen -> "g" | "ge" | "gen" | "gene" | "gener" | "genera" | "generat" | "generate"


####### REPLACE #######

replace ->
	_replace __ condition {% (data) => {
		const [gen,, cond] = data;
		const input = composeManyInputs(data);
		const parsed = gen.parsed.concat(cond.parsed);
		return simpleCompose(input, parsed);
	} %} |
	_replace {% id %}

_replace ->
	_rep __ var _ "=" _ exp {% (data) => {
		const [,,varName,,,,exp] = data;
		const input = composeManyInputs(data);
		return simpleCompose(input, [varName.parsed, exp.parsed]);
	} %}

_rep -> "replace"


####### RENAME #######

rename ->
	_rename __ var __ var {% (data) => {
		const [,,var1,,var2] = data;
		const input = composeManyInputs(data);
		return simpleCompose(input, [var1.parsed, var2.parsed]);
	} %}

_rename -> "ren" | "rena" | "renam" | "rename"


####### DROP #######

drop ->
	_drop __ condition  {% (data) => {
		const [drop,, cond] = data;
		const input = composeManyInputs(data);
		const parsed = drop.parsed.concat(cond.parsed);
		return simpleCompose(input, parsed);
	} %} |
	_drop {% id %} |
	_dr __ condition  {% (data) => {
		const [,, cond] = data;
		const input = composeManyInputs(data);
		const parsed = [null, cond.parsed];
		return simpleCompose(input, parsed);
	} %}

_drop ->
	_dr multivar {% (data) => {
		const [, varArray] = data;
		const input = composeManyInputs(data);
		return simpleCompose(input, [varArray.parsed]);
	}%}

_dr -> "drop"


####### KEEP #######

keep ->
	_keep __ condition  {% (data) => {
		const [keep,, cond] = data;
		const input = composeManyInputs(data);
		const parsed = keep.parsed.concat(cond.parsed);
		return simpleCompose(input, parsed);
	} %} |
	_keep {% id %} |
	_ke __ condition  {% (data) => {
		const [,, cond] = data;
		const input = composeManyInputs(data);
		const parsed = [null, cond.parsed];
		return simpleCompose(input, parsed);
	} %}

_keep ->
	_ke multivar {% (data) => {
		const [, varArray] = data;
		const input = composeManyInputs(data);
		return simpleCompose(input, [varArray.parsed]);
	}%}

_ke -> "keep"



####### MERGE #######

merge ->
	_merge __ "using" __ fname {% (data) => {
		const [merge,,using,,fname] = data;
		const input = composeManyInputs(data);
		const parsed = merge.parsed.concat(fname);
		return simpleCompose(input, parsed);
	} %}

_merge ->
	_mer multivar {% (data) => {
		const [merge, varArray] = data;
		const input = composeManyInputs(data);
		return simpleCompose(input, [merge.parsed, varArray.parsed]);
	} %}

_mer ->
	"merge" __ _rel {% (data) => {
		const [,, rel] = data;
		const input = composeManyInputs(data);
		const parsed = rel[0];
		return simpleCompose(input, parsed);
	} %}

_rel -> "1:1" | "1:m" | "m:1"


####### REGRESS #######

# accounts for opts or no opts
regression ->
	_regression _ "," _ regopts {% (data) => {
		const [reg,,,,options] = data;
		const input = composeManyInputs(data);
		const parsed = reg.parsed;
		// needed to ensure that options hit parsed[3]
		if (parsed.length < 3) parsed.push(null);
		parsed.push([options.parsed]);
		return simpleCompose(input, parsed);
	} %} |
	_regression {% id %}

# conditional or no conditional
_regression ->
	_regress __ condition {% (data) => {
		const [reg,, cond] = data;
		const input = composeManyInputs(data);
		const parsed = reg.parsed.concat(cond.parsed);
		return simpleCompose(input, parsed);
	} %} |
	_regress {% id %}

# regular structure
_regress ->
	_reg __ var multivar {% (data) => {
		const [,, yvar, xArray] = data;
		const input = composeManyInputs(data);
		const parsed = [yvar.parsed, xArray.parsed];
		return simpleCompose(input, parsed);
	}%}

_reg -> "reg" | "regr" | "regre" | "regres" | "regress"

regopts -> option["robust"] {% id %} | optionArgs["cluster"] {% id %}


####### PREDICT ########

predict ->
	_predict _ "," _ predictopts {% (data) => {
		const [predict,,,,options] = data;
		const input = composeManyInputs(data);
		const parsed = [predict.parsed]
		parsed.push([options.parsed]);
		return simpleCompose(input, parsed);
	} %} |
	_predict {% id %}

_predict ->
	"predict" __ var {% (data) => {
		const [predict,,pvar] = data;
		const input = composeManyInputs(data);
		return simpleCompose(input, [pvar.parsed]);
	} %}

predictopts -> option[residual] {% id %} | option["xb"] {% id %}

residual -> "re" | "res" | "resi" | "resid" | "residu" | "residua" | "residual"


####### TEST #######

test ->
	_test multivar {% (data) => {
		const [, varArray] = data;
		const input = composeManyInputs(data);
		return simpleCompose(input, [varArray.parsed]);
	} %}

_test -> "te" | "tes" | "test"



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
	if (input === 'if' || input === "using") return reject;
	return simpleCompose(input, input);
}%}

# filename: a bit more lenient than var
fname -> [\S]:+ {% (data) => data[0].join('') %}

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
	if (input.includes('if') || input.includes(',')) return reject;
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

function composeReplace([varname, exp, condition]) {
	return composeParsed('replace', [varname, exp], condition);
}

function composeRename(vars) {
	return composeParsed('rename', vars);
}

function composeDrop([vars, condition]) {
	return composeParsed('drop', vars, condition);
}

function composeKeep([vars, condition]) {
	return composeParsed('keep', vars, condition);
}


function composeMerge(args) {
	return composeParsed('merge', args);
}

function composeRegression([yvar, xArray, condition, options]) {
	return composeParsed('regress', [yvar, xArray], condition, options);
}

function composePredict([vars, options]) {
	return composeParsed('predict', vars, null, options);
}

function composeTest([vars]) {
	return composeParsed('test', vars);
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

%}

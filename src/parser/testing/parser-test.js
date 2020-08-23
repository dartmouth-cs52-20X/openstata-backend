/* eslint-disable import/no-dynamic-require */
const nearley = require('nearley');
const fs = require('fs');

if (process.argv.length < 4) {
  console.log('usage: node parser-test [grammar js file] [testcase testcase ...]');
  return 1;
}

console.log(`using grammar file ${process.argv[2]}`);
const grammar = require(process.argv[2]);

process.argv.slice(3).forEach((arg) => {
  const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
  try {
    const data = fs.readFileSync(arg, 'utf8');
    console.log();
    console.log(`file ${arg}`);
    console.log('actual read input:');
    console.log(data);
    parser.feed(data);
    const { results } = parser;
    console.log(`number of results: ${results.length}`);
    console.log('processed/regenerated input:');
    console.log(results[0].input);
    console.log('parsed python output:');
    console.dir(results[0].parsed, { depth: null });
    console.log();
    return 0;
  } catch (error) {
    console.log(error);
    return 2;
  }
});

return 0;
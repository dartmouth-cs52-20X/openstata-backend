const readline = require('readline');
const nearley = require('nearley');
const grammar = require('../index');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log('interpret some line!');

rl.on('line', (input) => {
  const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
  try {
    parser.feed(input);
    console.dir(parser.results[0], { depth: null });
  } catch (error) {
    console.log(error);
  }
});

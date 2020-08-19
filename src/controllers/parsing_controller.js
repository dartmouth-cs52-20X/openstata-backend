// import axios from 'axios';
import nearley from 'nearley';
import rawGrammar from '../parser';

// grammar to use
const grammar = nearley.Grammar.fromCompiled(rawGrammar);

// currently only parses without running
// eslint-disable-next-line import/prefer-default-export
export function parseStata(dofile) {
  const parser = new nearley.Parser(grammar);
  parser.feed(dofile);
  // here is where we would use axios to throw the compiled stuff @ flask instead of
  // directly returning it only
  return parser.results[0];
}

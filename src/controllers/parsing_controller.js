import nearley from 'nearley';
import rawGrammar from '../parser';

// grammar to use
const grammar = nearley.Grammar.fromCompiled(rawGrammar);

// eslint-disable-next-line import/prefer-default-export
export function parseStata(dofile) {
  const parser = new nearley.Parser(grammar);
  parser.feed(dofile);
  return parser.results[0];
}

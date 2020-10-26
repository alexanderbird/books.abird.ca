#!/bin/bash
readonly input=$1
readonly output=$2

set -e

[ "$input" == "" ] && {
  echo "Missing first parameter (input file)"
  exit 1
}
[ "$output" == "" ] && {
  echo "Missing second parameter (output file)"
  exit 1
}

cat <<EOT > /tmp/nearley.header.ts
// Edit the imports (top) and post-processing/exports (bottom) in nearleycompile_to_ts.sh
// Edit the grammar in src/searchDSL.ne
import nearley from 'nearley';
import { simplify } from './simpleSerializer';
EOT

npx --no-install nearleyc $input \
  | sed "3d;5s/^var/const/" \
  | grep -B 99999999999999 "if (typeof module !== 'undefined" \
  | grep -v "if (typeof module !== 'undefined" \
  > /tmp/nearley.body.ts

cat <<EOT > /tmp/nearley.footer.ts

export function parse(query: string, options: { ignoreAmbiguity?: boolean } = {}) {
  const nearleyParser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
  nearleyParser.feed(query);
  if (nearleyParser.results.length < 1) {
    throw new Error('Failed to parse. \n' + query);
  }
  if (!options.ignoreAmbiguity && nearleyParser.results.length > 1) {
    const summary = 'Bad bad bad. Grammar is ambiguous -- query has multiple valid interpretations';
    const details = nearleyParser.results.map(simplify).map(x => '  - ' + x).join('\n');
    const message = summary + ':\n' + query + '\n' + details;
    throw new Error(message);
  }
  return nearleyParser.results[0];
}

EOT

cat /tmp/nearley.{header,body,footer}.ts > $output

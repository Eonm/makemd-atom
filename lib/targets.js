/* eslint key-spacing: off  */

module.exports = {
  'build-pdf': { 'args': ['build', '--pdf']},
  'build-pdf-individually': { 'args': ['build', '--pdf', '-i']},
  'build-presentation': { 'args': ['build', '--presentation']},
  'build-presentation-individually': { 'args': ['build', '--presentation', '-i']},
  'update bibliography': { 'args': ['maintenance', '--update-bib']},
  'update csl': { 'args': ['maintenance', '--update-csl']},
  'init': { 'args': ['init', '--new']},
}

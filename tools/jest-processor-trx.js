var builder = require('jest-trx-results-processor');

var processor = builder({
  outputFile: 'testResults.trx',
});

module.exports = processor;

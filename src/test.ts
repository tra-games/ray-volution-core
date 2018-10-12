// tslint:disable:no-var-requires
// tslint:disable:no-require-imports
import { install } from 'source-map-support';

install();

const Jasmine = require('jasmine');
const SpecReporter = require('jasmine-spec-reporter').SpecReporter;
const TSConsoleReporter = require('jasmine-ts-console-reporter');

const jasmine = new Jasmine();

jasmine.loadConfig({
  spec_dir: 'dist',
  spec_files: [
    process.argv[2] ? process.argv[2] : '**/*.spec.js',
  ],
  helpers: [
    'test.js',
  ],
  stopSpecOnExpectationFailure: false,
});

jasmine.clearReporters();
jasmine.addReporter(new SpecReporter());
jasmine.addReporter(new TSConsoleReporter({
  print: (str) => {
    if (!str.includes('[32m.') && !str.includes('[31mF')) {
      process.stdout.write(str);
    }
  },
}));

jasmine.execute();

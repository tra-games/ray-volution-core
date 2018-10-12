const helper = require('./tools/helper');
const kill = require('kill-port');

const runTests = () => {
  const cb = () => {
    console.log('Running tests');
    const args = ['--inspect=9119', 'dist/test.js'];

    if (process.argv[2]) {
      args.push(process.argv[2]);
    }

    helper.runCmd({
      args,
      cmd: 'node',
      env: 'test',
    });
  };

  kill(9119)
  .then(cb)
  .catch(cb);
};

const child = helper.runCmd({
  cmd: 'node_modules/.bin/tsc',
  args: ['-p', 'tsconfig.spec.json', '-w'],
  env: 'test',
});

child.stdout.on('data', (a) => {
  if (a.toString().includes('Watching for file changes.')) {
    runTests();
  }
});

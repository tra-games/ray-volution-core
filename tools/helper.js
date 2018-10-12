const childProcess = require('child_process');

const runCmd = ({ cmd, args = [], env }, cb) => {
  console.log('executing cmd:', cmd, args.join(' '));

  const child = childProcess.spawn(cmd, args, {
    env: Object.assign({}, process.env, { NODE_ENV: env, TZ: 'UTC' }),
  });

  child
  .stdout
  .on('data', (data) => {
    process.stdout.write(data.toString());
  });

  child
  .stderr
  .on('data', (data) => {
    process.stderr.write(data.toString());
  });

  if (cb) {
    child
    .on('close', cb);
  }

  return child;
};

exports.runCmd = runCmd;

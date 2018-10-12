'use strict';

const shell = require('shelljs');
const chalk = require('chalk');

const SOURCE = `src`;
const FROM = `.tmp`;
const BUILD = `build`;
const ESM2015_DIR = `${BUILD}/esm2015`;
const ESM5_DIR = `${BUILD}/esm5`;
const OUT_DIR_ESM5 = `${BUILD}/package/esm5`;
const BUNDLES_DIR = `${BUILD}/bundles`;
const RELEASE = 'dist';

// const modules = ['.'];
const modules = ['resources'];

shell.rm(`-Rf`, `${FROM}`);
shell.rm(`-Rf`, `${BUILD}`);
shell.rm(`-Rf`, `${RELEASE}`);

shell.mkdir(`-p`, `./${FROM}`);

shell.cp('-R', `${SOURCE}/*`, `${FROM}`);

shell.mkdir(`-p`, `./${ESM2015_DIR}`);
shell.mkdir(`-p`, `./${ESM5_DIR}`);
shell.mkdir(`-p`, `./${BUNDLES_DIR}`);
shell.mkdir(`-p`, `./${RELEASE}`);

/* TSLint with Codelyzer */
// https://github.com/palantir/tslint/blob/master/src/configs/recommended.ts
// https://github.com/mgechev/codelyzer
shell.echo(`Start TSLint`);
shell.exec(`node_modules/.bin/tslint -p tslint.json -t stylish src/**/*.ts`);
shell.echo(chalk.green(`TSLint completed`));

const build = (module) => {
  const prefix = '../';
  const prefixN2 = '../../';
  const rollup = 'node_modules/.bin/rollup';
  const tsc = 'node_modules/.bin/tsc';

  shell.echo(`Start building ${module}...`);

  shell.mkdir(`${BUILD}/${module}`);
  shell.cp(`${FROM}/${module}/package.json`, `${BUILD}/${module}/package.json`);
  shell.cd(`${FROM}/${module}`);

  console.log('`${prefixN2 + tsc} -p tsconfig-build.json`', `${prefixN2 + tsc} -p tsconfig-build.json`);

  if (shell.exec(`${prefixN2 + tsc} -p tsconfig-build.json`).code !== 0) {
    shell.echo(chalk.red(`Error: TS compilation failed`));
    shell.exit(1);
  }

  shell.echo(chalk.green(`TS compilation completed`));

  /* BUNDLING PACKAGE */
  shell.echo(`Start bundling`);
  shell.echo(`Rollup package`);

  if (shell.exec(`${prefixN2 + rollup} -c ${prefix}rollup.es.config.js -i ${prefixN2}${BUILD}/${module}/index.js -o ${prefixN2}${ESM2015_DIR}/${module}.js`).code !== 0) {
    shell.echo(chalk.red(`Error: Rollup package failed`));
    shell.exit(1);
  }

  shell.echo(`Produce ESM5 version`);
  shell.exec(`${prefixN2 + tsc} -p tsconfig-build.json --target es5 -d false --outDir ${prefixN2}${OUT_DIR_ESM5} --importHelpers true --sourceMap`)

  if (shell.exec(`${prefixN2 + rollup} -c ${prefix}rollup.es.config.js -i ${prefixN2}${OUT_DIR_ESM5}/${module}/index.js -o ${prefixN2}${ESM5_DIR}/${module}.js`).code !== 0) {
    shell.echo(chalk.red(`Error: ESM5 version failed`));
    shell.exit(1);
  }

  shell.echo(`Run Rollup conversion on package`);

  if (shell.exec(`${prefixN2 + rollup} -c ${prefix}rollup.config.js -i ${prefixN2}${ESM5_DIR}/${module}.js -o ${prefixN2}${BUNDLES_DIR}/${module}.umd.js`).code !== 0) {
    shell.echo(chalk.red(`Error: Rollup conversion failed`));
    shell.exit(1);
  }

  shell.echo(chalk.green(`Bundling ${module} completed`));
  shell.cd(`${prefixN2}`);
};

for (const module of modules) {
  build(module);
}

for (const module of modules) {
  shell.rm(`-Rf`, `${BUILD}/${module}/**/*.js`);
  shell.rm(`-Rf`, `${BUILD}/${module}/**/*.js.map`);
  shell.mv(`${BUILD}/${module}`, `${RELEASE}/${module}`);
}

shell.mv(`${ESM2015_DIR}`, `${RELEASE}`);
shell.mv(`${ESM5_DIR}`, `${RELEASE}`);
shell.mv(`${BUNDLES_DIR}`, `${RELEASE}`);

shell.rm(`-Rf`, `${FROM}`);
shell.rm(`-Rf`, `${BUILD}`);

shell.echo(chalk.green(`End building`));

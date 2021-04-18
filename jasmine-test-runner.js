/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */

// import glob from "glob";
import Jasmine from 'jasmine';
import jSpecReporter from 'jasmine-spec-reporter';

export const jasmine = new Jasmine();

(function specReport() {
  const jasmineEnv = jasmine.jasmine.getEnv();
  jasmineEnv.clearReporters();
  jasmineEnv.addReporter(new jSpecReporter.SpecReporter());
  jasmineEnv.DEFAULT_TIMEOUT_INTERVAL = 50000;
  jasmineEnv.random = false;
  jasmine.requires.push('esm');
}());

export async function loadFiles(config, testFiles) {
  jasmine.loadConfigFile(config);
  for (const file of testFiles) {
    await import(file).catch((e) => {
      console.error('error loading ', file); // eslint-disable-line
      console.error({ e }); // eslint-disable-line
      process.exit(1);
    });
  }
}

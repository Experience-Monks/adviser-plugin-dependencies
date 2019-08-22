'use strict';

const depcheck = require('depcheck');
const Adviser = require('adviser');

const docs = require('../utils/docs');

class UnusedPackages extends Adviser.Rule {
  constructor(context) {
    super(context);

    const defaultProps = {
      exclude: []
    };

    this.parsedOptions = { ...defaultProps, ...this.context.options };
  }

  run(sandbox) {
    return new Promise((resolve, reject) => {
      depcheck(this.context.filesystem.dirname, { skipMissing: true, withoutDev: true })
        .then(unused => {
          const unusedDependencies = unused.dependencies.filter(dep => !this.parsedOptions.exclude.includes(dep));
          if (unusedDependencies.length > 0) {
            const message = `Found ${unusedDependencies.length} unused package`;

            const report = {
              message
            };

            if (this.context.verboseMode) {
              report['verbose'] = this.getVerboseMessage(unusedDependencies);
            }

            sandbox.report(report);
          }
          resolve();
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  getVerboseMessage(unusedDependencies) {
    let verboseOutput = '\n';
    unusedDependencies.forEach((packageKey, index) => {
      verboseOutput += `  - ${packageKey}`;
      verboseOutput += index <= unusedDependencies.length - 2 ? '\n' : '';
    });

    return `List of unused packages:${verboseOutput}`;
  }
}

UnusedPackages.meta = {
  category: 'Performance',
  description: 'Alert about not used dependencies',
  recommended: true,
  docsUrl: docs.getURL('unused-packages')
};

module.exports = UnusedPackages;

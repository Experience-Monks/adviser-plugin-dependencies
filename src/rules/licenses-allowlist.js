'use strict';

const licenseChecker = require('license-checker');
const Adviser = require('adviser');

const docs = require('../utils/docs');

class LicensesAllowlist extends Adviser.Rule {
  constructor(context) {
    super(context);

    if (!this.context.options.allowlist || !Array.isArray(this.context.options.allowlist)) {
      throw new Error(`Wrong allow-listed licenses, an array with licenses is expected`);
    }

    if (this.context.options.excludePackage && !Array.isArray(this.context.options.excludePackage)) {
      throw new Error(`Wrong excludePackages argument, an array is expected`);
    }

    const defaultProps = {
      includeNoProdPackages: false,
      excludePackage: []
    };

    this.parsedOptions = { ...defaultProps, ...this.context.options };
  }

  run(sandbox) {
    return new Promise((resolve, reject) => {
      licenseChecker.init(
        {
          start: this.context.filesystem.dirname,
          unknown: true,
          production: !this.parsedOptions.includeNoProdPackages,
          excludePackages: this.parsedOptions.excludePackage.join(';')
        },
        (err, packages) => {
          if (err) {
            reject(err);
          } else {
            if (packages) {
              const packageKeysList = Object.keys(packages);
              const noAllowedLicenses = packageKeysList.filter(packageKey => {
                return !this.parsedOptions.allowlist.includes(packages[packageKey].licenses);
              });

              if (noAllowedLicenses.length > 0) {
                const message = `Found ${noAllowedLicenses.length} package${
                  noAllowedLicenses.length > 1 ? 's' : ''
                } with not allowlisted licenses`;

                const report = {
                  message
                };

                if (this.context.verboseMode) {
                  let verboseOutput = '\n';
                  noAllowedLicenses.forEach((packageKey, index) => {
                    verboseOutput += `  - ${packageKey}: ${packages[packageKey].licenses}`;
                    verboseOutput += index <= noAllowedLicenses.length - 2 ? '\n' : '';
                  });
                  report['verbose'] = `No allowed licenses:${verboseOutput}`;
                }

                sandbox.report(report);
              }

              resolve();
            } else {
              reject(err);
            }
          }
        }
      );
    });
  }
}

LicensesAllowlist.meta = {
  category: 'Legal',
  description: 'List of allowed licenses',
  recommended: true,
  docsUrl: docs.getURL('licenses-allowlist')
};

module.exports = LicensesAllowlist;

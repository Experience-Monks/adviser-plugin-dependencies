'use strict';

const licenseChecker = require('license-checker');
const Adviser = require('adviser');

const docs = require('../utils/docs');

class LicensesWhitelist extends Adviser.Rule {
  constructor(context) {
    super(context);

    if (!this.context.options.whitelist || !Array.isArray(this.context.options.whitelist)) {
      throw new Error(`Wrong whitelisted licenses, an array with licenses is expected`);
    }

    if (this.context.options.excludePackage && !Array.isArray(this.context.options.excludePackage)) {
      throw new Error(`Wrong excludePackages argument, an array is expected`);
    }

    const defaultProps = {
      includeNoProdPackages: false,
      excludePackage: []
    };

    this.context.options = { ...defaultProps, ...this.context.options };
  }

  run(sandbox) {
    return new Promise((resolve, reject) => {
      licenseChecker.init(
        {
          start: this.context.filesystem.dirname,
          unknown: true,
          production: !this.context.options.includeNoProdPackages,
          excludePackages: this.context.options.excludePackage.join(';')
        },
        (err, packages) => {
          if (err) {
            reject(err);
          } else {
            if (packages) {
              const packageKeysList = Object.keys(packages);
              const noWhitelistedLicenses = packageKeysList.filter(packageKey => {
                return !this.context.options.whitelist.includes(packages[packageKey].licenses);
              });

              if (noWhitelistedLicenses.length > 0) {
                const message = `Found ${noWhitelistedLicenses.length} package${
                  noWhitelistedLicenses.length > 1 ? 's' : ''
                } with not whitelisted licenses`;

                const report = {
                  message
                };

                if (this.context.verboseMode) {
                  let verboseOutput = '\n';
                  noWhitelistedLicenses.forEach((packageKey, index) => {
                    verboseOutput += `  - ${packageKey}: ${packages[packageKey].licenses}`;
                    verboseOutput += index <= noWhitelistedLicenses.length - 2 ? '\n' : '';
                  });
                  report['verbose'] = `No whitelisted licenses:${verboseOutput}`;
                }

                sandbox.report(report);
                resolve();
              }
            } else {
              reject(err);
            }
          }
        }
      );
    });
  }
}

LicensesWhitelist.meta = {
  category: 'Licenses',
  description: 'List of whitelisted licenses',
  recommended: true,
  docsUrl: docs.getURL('licenses-whitelist')
};

module.exports = LicensesWhitelist;

'use strict';

const path = require('path');
const getBuiltPackageStats = require('package-build-stats');
const Adviser = require('adviser');

const docs = require('../utils/docs');

class PackageSize extends Adviser.Rule {
  constructor(context) {
    super(context);

    if (this.context.options.hasOwnProperty('whitelist') && !Array.isArray(this.context.options.whitelist)) {
      throw new Error(`Wrong whitelist argument, an array with packages names is expected`);
    }

    const defaultProps = {
      threshold: 30,
      whitelist: ['adviser', 'adviser-plugin-dependencies', 'package-build-stats']
    };

    this.parsedOptions = { ...defaultProps, ...this.context.options };
  }

  _generateReport(packages = []) {
    const inlinePackages = packages.map(pkg => pkg.name).join(', ');
    return `Found heavy packages: ${inlinePackages}`;
  }

  _generateVerboseReport(packages = [], skips = []) {
    const inlinePackages = packages.reduce((accu, pkg) => {
      return ` ${accu}   - ${pkg.name}: ${pkg.gzip} kb \n`;
    }, '\n');

    const baseMessage = `Found heavy packages: ${inlinePackages}`;

    if (skips.length > 0) {
      const skipPackages = skips.reduce((accu, pkg) => {
        return ` ${accu}   - ${pkg.name} \n`;
      }, '\n');

      return `${baseMessage} \n  Skipped packages: ${skipPackages}`;
    }

    return baseMessage;
  }

  async run(sandbox) {
    const packagejson = require(path.join(this.context.filesystem.dirname, 'package.json'));
    const packages = [];
    const promises = [];
    const results = [];
    const skip = [];

    if (packagejson.hasOwnProperty('dependencies')) {
      const dependencies = Object.keys(packagejson['dependencies']);
      const versionFilter = new RegExp('[^0-9.]+');

      try {
        // attempting to identify the most accurate version number possible using package-lock.json
        const packagelockjson = require(path.join(this.context.filesystem.dirname, 'package-lock.json'));

        dependencies.forEach((name, index) => {
          const version = packagelockjson['dependencies'][name]['version'].replace(versionFilter, '');
          packages.push({ name: name, version: version });
        });
      } catch {
        dependencies.forEach((name, index) => {
          const version = packagejson['dependencies'][name].replace(versionFilter, '');
          packages.push({ name: name, version: version });
        });
      }
    }

    packages.forEach(pkg => {
      if (!this.parsedOptions.whitelist.includes(pkg.name)) {
        promises.push(getBuiltPackageStats(`${pkg.name}@${pkg.version}`, { client: 'npm' }).catch(() => null));
      }
    });

    const values = await Promise.all(promises);

    values.forEach((value, index) => {
      if (!value) {
        skip.push({ name: packages[index].name });
      }

      if (value && value.gzip >= this.parsedOptions.threshold * 1000) {
        results.push({ name: packages[index].name, gzip: (value.gzip / 1000).toFixed(2) });
      }
    });

    if (results.length > 0) {
      const message = this._generateReport(results);
      const verbose = this._generateVerboseReport(results, skip);

      const report = {
        message,
        verbose
      };

      sandbox.report(report);
    }
  }
}

PackageSize.meta = {
  category: 'Performance',
  description: 'Identifies large size dependencies',
  recommended: true,
  docsUrl: docs.getURL('package-size')
};

module.exports = PackageSize;

'use strict';

const path = require('path');
const getBuiltPackageStats = require('package-build-stats');
const Adviser = require('adviser');

const docs = require('../utils/docs');

class PackageSize extends Adviser.Rule {
  constructor(context) {
    super(context);

    if (!Array.isArray(this.context.options.whitelist)) {
      throw new Error(`Wrong whitelist argument, an array with packages names is expected`);
    }

    const defaultProps = {
      threshold: 30,
      whitelist: ['adviser', 'adviser-plugin-dependencies', 'package-build-stats']
    };

    this.parsedOptions = { ...defaultProps, ...this.context.options };
  }

  _getPackageJsonPath() {
    let packagejson = {};

    try {
      packagejson = require(path.join(this.context.filesystem.dirname, 'package.json'));
    } catch (error) {
      throw new Error(`Couldn't find a package.json`, error);
    }

    return packagejson;
  }

  _generateReport(results = [], skips = [], isVerbose = false) {
    const report = `Found heavy packages: \n${results
      .map(result => {
        return `\t${result.name} ${isVerbose ? result.gzip + 'kb' : null}\n`;
      })
      .join('')}\n
      Packages skipped:\n${skips
        .map(skip => {
          return `\t${skip.name}\n`;
        })
        .join('')}`;

    return report;
  }

  async run(sandbox) {
    const packagejson = this._getPackageJsonPath();
    let packages = [];
    const promises = [];
    const results = [];
    const skip = [];

    if (packagejson.hasOwnProperty('dependencies')) {
      packages = packages.concat(Object.keys(packagejson['dependencies']));
    }

    packages.forEach(pkg => {
      if (!this.parsedOptions.whitelist.includes(pkg)) {
        promises.push(getBuiltPackageStats(pkg, { client: 'npm' }).catch(() => null));
      }
    });

    const values = await Promise.all(promises);

    values.forEach((value, index) => {
      if (!value) {
        skip.push({ name: packages[index] });
      }

      if (value && value.gzip >= this.parsedOptions.threshold) {
        results.push({ name: packages[index], gzip: (value.gzip / 1000).toFixed(2) });
      }
    });

    if (results.length > 0) {
      const message = this._generateReport(results, skip);
      const verbose = this._generateReport(results, skip, true);

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

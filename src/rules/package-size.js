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
      threshold: 30000,
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

  async run(sandbox) {
    const packagejson = this._getPackageJsonPath();
    let packages = [];
    let promises = [];
    let results = [];

    if (packagejson['dependencies'] !== undefined) {
      packages = packages.concat(Object.keys(packagejson['dependencies']));
    }

    packages.map(p => {
      if (!this.parsedOptions.whitelist.includes(p)) {
        promises.push(getBuiltPackageStats(p, { client: 'npm' }));
      }
    });

    await Promise.all(promises).then(values => {
      values.map((value, index) => {
        results.push({ name: packages[index], gzip: value.gzip });
      });

      const heavyPackages = results.filter(result => result.gzip >= this.parsedOptions.threshold);

      if (heavyPackages.length > 0) {
        const message = `Found heavy packages: \n${heavyPackages
          .map(p => {
            return `\t${p.name} ${(p.gzip / 1000).toFixed(2)}kb\n`;
          })
          .join('')}`;

        const report = {
          message
        };

        sandbox.report(report);
      }
    });
  }
}

PackageSize.meta = {
  category: 'Performance',
  description: 'Identifies large size dependencies',
  recommended: true,
  docsUrl: docs.getURL('heavy-packages')
};

module.exports = PackageSize;

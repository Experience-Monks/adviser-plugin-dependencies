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
      return ` ${accu}   - ${pkg.name} ${pkg.version}: ${pkg.gzip} kb \n`;
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
    const processing = { packages: [], stats: [] };
    const promises = [];
    const results = { complete: [], skip: [] };

    if (packagejson.hasOwnProperty('dependencies')) {
      const dependencies = Object.keys(packagejson['dependencies']);

      dependencies.forEach((name, index) => {
        if (!this.parsedOptions.whitelist.includes(name)) {
          const dependency = { name: name, version: '' };

          try {
            const dependancyPath = path.join(
              this.context.filesystem.dirname,
              'node_modules',
              dependency.name,
              'package.json'
            );
            dependency.version = require(dependancyPath).version;
          } catch {
            dependency.version = 'latest';
          }

          processing.packages.push(dependency);
          promises.push(
            getBuiltPackageStats(`${dependency.name}@${dependency.version}`, { client: 'npm' }).catch(() => null)
          );
        }
      });
    }

    processing.stats = await Promise.all(promises);

    processing.stats.forEach((value, index) => {
      if (!value) {
        results.skip.push({ name: processing.packages[index].name });
      }

      if (value && value.gzip >= this.parsedOptions.threshold * 1000) {
        results.complete.push({
          name: processing.packages[index].name,
          version: processing.packages[index].version,
          gzip: (value.gzip / 1000).toFixed(2)
        });
      }
    });

    if (results.complete.length > 0) {
      const message = this._generateReport(results.complete);
      const verbose = this._generateVerboseReport(results.complete, results.skip);

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

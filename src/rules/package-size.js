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

  _getDependencyNames(pkgJson = {}, whitelist = []) {
    if (pkgJson.hasOwnProperty('dependencies') && typeof pkgJson === 'object') {
      const names = Object.keys(pkgJson['dependencies']);
      return names.filter(name => !whitelist.includes(name));
    } else {
      return [];
    }
  }

  _extractDependencyVersions(directoryFragments = [], names = []) {
    return names.map(function(name) {
      try {
        const dependencyPath = path.join(...directoryFragments, name, 'package.json');
        const dependencyMeta = require(dependencyPath);
        return { name: name, version: dependencyMeta.version };
      } catch {
        return { name: name, version: 'latest' };
      }
    });
  }

  _generateDependencyStats(statBuilder, packages = []) {
    const statPromises = packages.map(async function(pkg) {
      const stats = await statBuilder(`${pkg.name}@${pkg.version}`, { client: 'npm' }).catch(() => null);
      const fullData = {
        name: pkg.name,
        version: pkg.version,
        size: stats && stats.gzip ? (stats.gzip / 1000).toFixed(2) : null
      };
      return fullData;
    });

    return Promise.all(statPromises);
  }

  _identifySkips(packages = []) {
    return packages.filter(pkg => !pkg.size);
  }

  _identifyLargePackages(packages = [], threshold = 0) {
    return packages.filter(pkg => pkg.size && pkg.size >= threshold);
  }

  _generateReport(packages = []) {
    if (packages.length > 0) {
      const inlinePackages = packages.map(pkg => pkg.name).join(', ');
      return `Found heavy packages: ${inlinePackages}`;
    } else {
      return 'No heavy packages found.';
    }
  }

  _generateVerboseReport(packages = [], skips = []) {
    let baseMessage = 'No heavy packages found.';

    if (packages.length > 0) {
      const inlinePackages = packages.reduce((accu, pkg) => {
        return ` ${accu}   - ${pkg.name} ${pkg.version}: ${pkg.size} kb \n`;
      }, '\n');

      baseMessage = `Found heavy packages: ${inlinePackages}`;
    }

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
    const names = this._getDependencyNames(packagejson, this.parsedOptions.whitelist);
    const versions = this._extractDependencyVersions([this.context.filesystem.dirname, 'node_modules'], names);
    const stats = await this._generateDependencyStats(getBuiltPackageStats, versions);
    const skips = this._identifySkips(stats);
    const largePackages = this._identifyLargePackages(stats, this.parsedOptions.threshold);

    if (largePackages.length > 0) {
      const report = {
        message: this._generateReport(largePackages),
        verbose: this._generateVerboseReport(largePackages, skips)
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

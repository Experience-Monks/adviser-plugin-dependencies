'use strict';

const path = require('path');
const request = require('request-promise-native');
const Adviser = require('adviser');

const DEPENDENCIES = ['dependencies', 'devDependencies', 'peerDependencies'];
const INDICATORS = Object.freeze({
  DOWNLOADS: 'downloads',
  LAST_UPDATE: 'last-update',
  MAINTAINERS: 'maintainers',
  OPEN_ISSUES: 'open-issues',
  STARS: 'stars',
  WATCHERS: 'watchers',
  FORKS: 'forks'
});

class SuspiciousPackage extends Adviser.Rule {
  constructor(context) {
    super(context);

    const defaultProps = {
      indicators: {},
      whitelist: ['adviser', 'adviser-plugin-dependencies']
    };
    this.parsedOptions = {};
    this.parsedOptions.indicators = { ...defaultProps.indicators, ...this.context.options.indicators };
    this.parsedOptions.whitelist = [...defaultProps.whitelist, ...this.context.options.whitelist];
    this.packageData = this._genPackageData();
  }

  async run(sandbox) {
    const suspiciousPackages = [];
    const indicators = Object.values(INDICATORS).filter(indicator =>
      Object.keys(this.parsedOptions.indicators).includes(indicator)
    );

    await this._forEachAsync(indicators, async indicator => {
      const pkgs = () => this._getPackages().filter(pkg => !suspiciousPackages.includes(pkg));
      switch (indicator) {
        case INDICATORS.STARS:
          console.log('here');
          suspiciousPackages.push(...(await this._validatePackage(pkgs(), this._genPackageStars, INDICATORS.STARS)));
          break;
        case INDICATORS.DOWNLOADS:
          suspiciousPackages.push(
            ...(await this._validatePackage(pkgs(), this._genDownloadCount, INDICATORS.DOWNLOADS))
          );
          break;
        case INDICATORS.LAST_UPDATE:
          suspiciousPackages.push(
            ...(await this._validatePackage(pkgs(), this._genPackageLastUpdated, INDICATORS.LAST_UPDATE))
          );
          break;
        case INDICATORS.MAINTAINERS:
          suspiciousPackages.push(
            ...(await this._validatePackage(pkgs(), this._genPackageMaintainers, INDICATORS.MAINTAINERS))
          );
          break;
        case INDICATORS.OPEN_ISSUES:
          suspiciousPackages.push(
            ...(await this._validatePackage(pkgs(), this._genPackageOpenIssues, INDICATORS.OPEN_ISSUES))
          );
          break;
        case INDICATORS.WATCHERS:
          suspiciousPackages.push(
            ...(await this._validatePackage(pkgs(), this._genPackageWatchers, INDICATORS.WATCHERS))
          );
          break;
        case INDICATORS.FORKS:
          suspiciousPackages.push(...(await this._validatePackage(pkgs(), this._genPackageForks, INDICATORS.FORKS)));
          break;
      }
    });
    console.log(suspiciousPackages);
  }

  async _filterAsync(arr = [], predicator = () => {}) {
    const results = await Promise.all(arr.map(val => predicator(val)));
    return arr.filter((_value, i) => results[i]);
  }

  async _forEachAsync(arr = [], cb = () => {}) {
    await Promise.all(arr.map(cb));
  }

  _getPackages() {
    const packagejson = require(path.join(this.context.filesystem.dirname, 'package.json'));
    return DEPENDENCIES.flatMap(dep => {
      if (packagejson[dep] !== undefined) {
        return Object.keys(packagejson[dep]);
      }
    }).filter(pkgName => pkgName !== undefined && pkgName !== null && !this.parsedOptions.whitelist.includes(pkgName));
  }

  // Memoized
  _genPackageData() {
    let packageCache = {};
    return (packageName = '', option = '') => {
      if (!(packageName in packageCache)) {
        packageCache[packageName] = request({ uri: `https://api.npms.io/v2/package/${packageName}`, json: true })
          .then(data => data.collected)
          .catch(err => {
            throw err;
          });
      }
      return packageCache[packageName];
    };
  }

  _genDownloadCount(packageName = '') {
    if (packageName) {
      return request({ uri: `https://api.npmjs.org/downloads/point/last-month/${packageName}`, json: true })
        .then(data => data.downloads)
        .catch(err => {
          throw err;
        });
    }
    throw new Error(`"${packageName}" is not valid a package name`);
  }

  _genPackageLastUpdated = async (packageName = '') => {
    const monthInSeconds = 2419200000;
    if (packageName) {
      return request({ uri: `https://registry.npmjs.org/${packageName}`, json: true })
        .then(data => (Date.now() - Date.parse(data.time.modified)) / monthInSeconds)
        .catch(err => {
          throw err;
        });
    }
    throw new Error(`"${packageName}" is not valid a package name`);
  };

  _genPackageMaintainers = async (packageName = '') => {
    if (packageName) {
      let { metadata } = await this.packageData(packageName);
      if (metadata) {
        return metadata.maintainers.length;
      }
    }
    throw new Error(`"${packageName}" is not valid a package name`);
  };

  _genPackageOpenIssues = async (packageName = '') => {
    if (packageName) {
      let { github } = await this.packageData(packageName);
      if (github) {
        return github.issues && github.issues.count;
      }
    }
    throw new Error(`"${packageName}" is not valid a package name`);
  };

  _genPackageStars = async (packageName = '') => {
    if (packageName) {
      let { github } = await this.packageData(packageName);
      if (github) {
        return github.starsCount;
      }
    }
    throw new Error(`"${packageName}" is not valid a package name`);
  };

  _genPackageWatchers = async (packageName = '') => {
    if (packageName) {
      let { github } = await this.packageData(packageName);
      return github.subscribersCount;
    }
    throw new Error(`"${packageName}" is not valid a package name`);
  };

  _genPackageForks = async (packageName = '') => {
    if (packageName) {
      let { github } = await this.packageData(packageName);
      return github.forksCount;
    }
    throw new Error(`"${packageName}" is not valid a package name`);
  };

  async _validatePackage(packages = [], indicatorFn = () => {}, indicator = '') {
    if (Array.isArray(packages) && packages.length > 0) {
      return this._filterAsync(packages, async pkg => {
        if (indicator === INDICATORS.OPEN_ISSUES || indicator === INDICATORS.LAST_UPDATE) {
          return (await indicatorFn(pkg)) > this.parsedOptions.indicators[indicator];
        } else {
          return (await indicatorFn(pkg)) < this.parsedOptions.indicators[indicator];
        }
      });
    }
    throw new Error('A valid array is expected');
  }
}

SuspiciousPackage.meta = {
  category: 'Security',
  description: 'Identifies suspicious packages based on ',
  recommended: true
};

module.exports = SuspiciousPackage;

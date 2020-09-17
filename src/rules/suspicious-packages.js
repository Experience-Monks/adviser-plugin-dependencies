'use strict';

const fs = require('fs');
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

    if (
      this.context.options.indicators.length < 1 ||
      !this.context.options.indicators ||
      Array.isArray(this.context.options.indicators)
    ) {
      throw new Error(`Wrong indicators, an array with indicators is expected`);
    }
    this.packageData = this._genPackageData();
    this.parsedOptions = { ...this.context.options };
  }

  async run(sandbox) {
    var lastRuntime = await this._genRuntime();
    if (!lastRuntime) {
      lastRuntime = Date.now();
    }

    const indicators = this.parsedOptions.indicators;

    let packages = await this._getValidPackages().map(pkg => {
      const packageData = { packageName: pkg };
      console.log(indicators);
      indicators.keys(indicator => {
        console.log(this.packageData);
        switch (indicator) {
          case INDICATORS.STARS:
            this.packageData[INDICATORS.STARS] = this._genPackageStars(pkg);
            break;
        }
      });
      return packageData;
    });
    console.log(packages);

    // selected indicators to look for on packages
    // can use dot notation to scry through
    // let indicators = this.parsedOptions.indicators;

    // console.log(await this._genDownloadCount(packages[0]));
    // console.log(await this._genPackageLastUpdated(packages[0]));
    // console.log(await this._genPackageMaintainers(packages[0]));
    // console.log(await this._genPackageOpenIssues(packages[0]));
    // console.log(await this._genPackageStars(packages[0]));
    // console.log(await this._genPackageForks(packages[0]));

    this._setRuntime();
    // }
  }

  _getValidPackages() {
    const packagejson = require(path.join(this.context.filesystem.dirname, 'package.json'));
    return DEPENDENCIES.flatMap(dep => {
      if (packagejson[dep] !== undefined) {
        return Object.keys(packagejson[dep]);
      }
    }).filter(pkg => pkg);
  }

  _genPackageChangeTime() {
    return new Promise((resolve, reject) => {
      fs.stat(path.join(this.context.filesystem.dirname, 'package.json'), (err, stats) => {
        if (!err) {
          resolve(stats.ctimeMs);
        }
        return reject(err);
      });
    });
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
    throw new Error(`A valid package name is expected`);
  }

  async _genPackageLastUpdated(packageName = '') {
    if (packageName) {
      let { metadata } = await this.packageData(packageName);
      if (metadata) {
        return metadata.date;
      }
    }
    throw new Error(`A valid package name is expected`);
  }

  async _genPackageMaintainers(packageName = '') {
    if (packageName) {
      let { metadata } = await this.packageData(packageName);
      if (metadata) {
        return metadata.maintainers.length;
      }
    }
    throw new Error(`A valid package name is expected`);
  }

  async _genPackageOpenIssues(packageName = '') {
    if (packageName) {
      let { github } = await this.packageData(packageName);
      if (github) {
        return github.issues && github.issues.count;
      }
    }
    throw new Error(`A valid package name is expected`);
  }

  async _genPackageStars(packageName = '') {
    if (packageName) {
      let { github } = await this.packageData(packageName);
      if (github) {
        return github.starsCount;
      }
    }
    throw new Error(`A valid package name is expected`);
  }

  async _genPackageForks(packageName = '') {
    if (packageName) {
      let { github } = await this.packageData(packageName);
      return github.forksCount;
    }
    throw new Error(`A valid package name is expected`);
  }
}

SuspiciousPackage.meta = {
  category: 'Security',
  description: 'Identifies suspicious packages based on ',
  recommended: true
};

module.exports = SuspiciousPackage;

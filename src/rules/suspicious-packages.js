'use strict';

const fs = require('fs');
const path = require('path');
const request = require('request-promise-native');
const Adviser = require('adviser');

const DEPENDENCIES = ['dependencies', 'devDependencies', 'peerDependencies'];
// const INDICATORS = ['downloads', 'last-update', 'maintainers', 'open-issues', 'stars', 'watchers', 'forks', 'archived'];
const INDICATORS = Object.freeze({
  DOWNLOADS: 'downloads',
  LAST_UPDATE: 'last-update',
  MAINTAINERS: 'maintainers',
  OPEN_ISSUES: 'open-issues',
  STARS: 'stars',
  WATCHERS: 'watchers',
  FORKS: 'forks'
});
const RUN_LOG = '.suspicious-packages-log';

class SuspiciousPackage extends Adviser.Rule {
  constructor(context) {
    super(context);

    if (!this.context.options.indicators) {
      throw new Error(`Wrong indicators, an array with indicators is expected`);
    }
    this.packageData = this._genPackageData();
    this.parsedOptions = { ...this.context.options };
  }

  /* 
  IF log file exists
    Get package.json change time
    Get Log file lastRun prop
    IF change time is newer than last run
      Run through checks
    ELSE
      Output message to say we aren't running
  */

  // Checks:
  // see which indicators are within the options
  // query for those using functions
  // CREATE OBJ: indicators which don't meet threshold
  // Return message

  async run(sandbox) {
    var lastRuntime = await this._genRuntime();
    if (!lastRuntime) {
      lastRuntime = Date.now();
    }

    const modifiedTime = await this._genPackageChangeTime();

    // IF change time is newer than last run
    if (Number.parseFloat(modifiedTime) - Number.parseFloat(lastRuntime) > 0) {
      const packagejson = require(path.join(this.context.filesystem.dirname, 'package.json'));

      // Checks:
      // see which indicators are within the options
      // query for those using functions
      // CREATE OBJ: indicators which don't meet threshold
      // Return message

      let packages = [];
      DEPENDENCIES.map(dep => {
        if (packagejson[dep] !== undefined) {
          packages = packages.concat(Object.keys(packagejson[dep]));
        }
      });

      // selected indicators to look for on packages
      // can use dot notation to scry through
      let indicators = this.parsedOptions.indicators;

      this._setRuntime();
    }
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

  //         //['downloads', 'last-update', 'maintainers', 'open-issues', 'stars', 'watchers', 'forks', 'archived']

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

  _setRuntime() {
    fs.open(path.join(this.context.filesystem.dirname, RUN_LOG), 'w', (err, fd) => {
      if (!err) {
        fs.write(fd, JSON.stringify({ lastRun: Date.now() }), err => {
          if (err) throw err;
        });
      }
      fs.close(fd);
    });
  }

  _genRuntime() {
    return new Promise((resolve, reject) =>
      fs.stat(path.join(this.context.filesystem.dirname, RUN_LOG), (err, stats) => {
        if (err) return reject(err);
        fs.open(path.join(this.context.filesystem.dirname, RUN_LOG), 'r', (err, fd) => {
          if (!err) {
            let bufferSize = Number.parseInt(stats.size) || 30;
            fs.read(fd, Buffer.alloc(Number.parseInt(bufferSize)), 0, bufferSize, 0, (err, read, buffer) => {
              let jsonStringFromLog = buffer.toString().slice(0, read);
              fs.close(fd);
              if (err) return reject(err);
              resolve(JSON.parse(jsonStringFromLog).lastRun);
            });
          }
        });
      })
    );
  }
}

SuspiciousPackage.meta = {
  category: 'Security',
  description: 'Identifies suspicious packages based on ',
  recommended: true
};

module.exports = SuspiciousPackage;

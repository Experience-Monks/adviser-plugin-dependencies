'use strict';

const spawn = require('cross-spawn');
const semverDiff = require('semver-diff');
const semver = require('semver');
const Adviser = require('adviser');

const docs = require('../utils/docs');

const CRITERIA = ['patch', 'minor', 'major'];

class OutDatedPackages extends Adviser.Rule {
  constructor(context) {
    super(context);

    if (this.context.options.criteria && !CRITERIA.includes(this.context.options.criteria)) {
      throw new Error(`Wrong criteria options, should be one of: 'patch', 'minor' or 'major'`);
    }

    const defaultProps = {
      criteria: 'major',
      exclude: []
    };

    this.parsedOptions = { ...defaultProps, ...this.context.options };
  }

  run(sandbox) {
    let result = {};
    const outdatedAccumulator = [];

    const output = spawn.sync('npm', ['outdated', '--json', 'true']);

    try {
      result = JSON.parse(output.stdout);

      if (output.error) {
        throw new Error(output.error.summary || output.error.message);
      }
    } catch (error) {
      throw new Error(error);
    }

    Object.keys(result).forEach(pkg => {
      if (!this.parsedOptions.exclude.includes(pkg)) {
        if (semver.valid(result[pkg].current) && semver.valid(result[pkg].latest)) {
          const semverDiffResult = semverDiff(result[pkg].current, result[pkg].latest);

          if (semverDiffResult === this.parsedOptions.criteria) {
            outdatedAccumulator.push({ ...result[pkg], pkg });
          }
        }
      }
    });

    if (outdatedAccumulator.length > 0) {
      const message = `Found outdated ${outdatedAccumulator.length} package${
        outdatedAccumulator.length > 1 ? 's' : ''
      } with ${this.parsedOptions.criteria} updates`;

      const report = {
        message
      };

      if (this.context.verboseMode) {
        const verbose = this.getVerboseMessage(outdatedAccumulator);
        report['verbose'] = verbose;
      }

      sandbox.report(report);
    }
  }

  getVerboseMessage(outdatedAccumulator) {
    let message = outdatedAccumulator.reduce((accu, item) => {
      return ` ${accu}   - ${item.pkg}: ${item.current} -> ${item.latest} \n`;
    }, '\n');

    return `Outdated dependencies with ${this.parsedOptions.criteria} updates: ${message}
   Run "npm outdated" for more details`;
  }
}

OutDatedPackages.meta = {
  category: 'Security',
  description: 'Alert about outdated dependencies',
  recommended: true,
  docsUrl: docs.getURL('outdated-packages')
};

module.exports = OutDatedPackages;

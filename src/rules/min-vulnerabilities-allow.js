'use strict';

const path = require('path');
const spawn = require('cross-spawn');
const Adviser = require('adviser');

const docs = require('../utils/docs');

const SEVERITY_LEVEL = ['info', 'low', 'moderate', 'high', 'critical'];

class MinVulnerabilityAllow extends Adviser.Rule {
  constructor(context) {
    super(context);

    if (!this.context.options.level || !SEVERITY_LEVEL.includes(this.context.options.level)) {
      throw new Error(`Wrong level options, should be one of: 'info', 'low', 'moderate', 'high', 'critical'`);
    }

    const defaultProps = {
      skip: []
    };

    this.parsedOptions = { ...defaultProps, ...this.context.options };
  }

  run(sandbox) {
    let result = {};
    let vulnerabilitiesFound = false;
    const minVulnerabilityIndex = SEVERITY_LEVEL.indexOf(this.parsedOptions.level);
    const severityAccumulator = {
      counter: {},
      packages: []
    };

    const projectDependencies = this.getDependecies();
    const output = spawn.sync('npm', ['audit', '--json']);

    try {
      result = JSON.parse(output.stdout);

      if (output.error) {
        throw new Error(output.error.summary || output.error.message);
      }
    } catch (error) {
      throw new Error(error);
    }

    const vulnerabilities = this.formatReport(result);

    if (vulnerabilities) {
      const checkList = Object.keys(
        this.parsedOptions.production && projectDependencies ? projectDependencies : vulnerabilities
      );

      checkList.forEach(advisorKey => {
        if (vulnerabilities[advisorKey] && !this.parsedOptions.skip.includes(advisorKey)) {
          const vulnerabilitySeverity = vulnerabilities[advisorKey].severity;
          const vulnerabilitySeverityIndex = SEVERITY_LEVEL.indexOf(vulnerabilitySeverity);

          if (vulnerabilitySeverityIndex >= minVulnerabilityIndex) {
            vulnerabilitiesFound = true;

            severityAccumulator.counter[vulnerabilitySeverity] =
              severityAccumulator.counter[vulnerabilitySeverity] !== undefined
                ? ++severityAccumulator.counter[vulnerabilitySeverity]
                : 1;

            severityAccumulator.packages.push({
              package: vulnerabilities[advisorKey].name,
              severity: vulnerabilities[advisorKey].severity
            });
          }
        }
      });
    }

    if (vulnerabilitiesFound) {
      const message = this.getMessage(severityAccumulator.counter);

      const report = {
        message
      };

      if (this.context.verboseMode) {
        const verbose = this.getVerboseMessage(severityAccumulator.packages);
        report['verbose'] = verbose;
      }

      sandbox.report(report);
    }
  }

  formatReport(npmJson) {
    const reportVersion = npmJson.auditReportVersion || 1;
    const reportObj = reportVersion === 2 ? npmJson.vulnerabilities : npmJson.advisories;

    const formatedList = Object.keys(reportObj).reduce((acc, item) => {
      const packageName = reportVersion === 1 ? reportObj[item].module_name : item;

      acc[packageName] = reportObj[item];

      if (reportVersion === 1) {
        acc[packageName].name = reportObj[item].module_name;
      }

      return acc;
    }, {});

    return formatedList;
  }

  getMessage(severityCounter) {
    let counterMessage = Object.keys(severityCounter).reduce((accu, item) => {
      return `${accu} ${severityCounter[item]} ${item},`;
    }, '');

    counterMessage = counterMessage.substr(0, counterMessage.length - 1);

    return `Found vulnerabilities above the value "${this.parsedOptions.level}":${counterMessage}`;
  }

  getVerboseMessage(severityPackages) {
    let message = severityPackages.reduce((accu, item) => {
      return ` ${accu}   - ${item.package}: ${item.severity} \n`;
    }, '\n');

    return `Packages with vulnerabilities above ${this.parsedOptions.level}: ${message}
   Run "npm audit" for more details`;
  }

  getDependecies() {
    const packagejson = require(path.join(this.context.filesystem.dirname, 'package.json'));

    if (packagejson.dependencies) {
      return packagejson.dependencies;
    } else {
      return false;
    }
  }
}

MinVulnerabilityAllow.meta = {
  category: 'Security',
  description: 'Monitor for dependencies with vulnerabilities',
  recommended: true,
  docsUrl: docs.getURL('min-vulnerabilities-allow')
};

module.exports = MinVulnerabilityAllow;

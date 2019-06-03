'use strict';
const path = require('path');
const Adviser = require('adviser');

const docs = require('../utils/docs');

const DEPENDENCIES = ['dependencies', 'devDependencies', 'peerDependencies'];

class NotAllowedPackages extends Adviser.Rule {
  constructor(context) {
    super(context);

    if (!this.context.options.packages || !Array.isArray(this.context.options.packages)) {
      throw new Error(`Wrong packages argument, an array with packages names is expected`);
    }
  }

  run(sandbox) {
    // TODO: Find all the locations of package.json
    try {
      const packagejson = require(path.join(this.context.filesystem.dirname, 'package.json'));

      let packages = [];
      DEPENDENCIES.map(dep => {
        if (packagejson[dep] !== undefined) {
          packages = packages.concat(Object.keys(packagejson[dep]));
        }
      });

      const notAllowedPackages = packages.filter(pkg => this.context.options.packages.includes(pkg));

      if (notAllowedPackages.length > 0) {
        const message = `Found not allowed packages: ${notAllowedPackages}`;

        const report = {
          message
        };

        sandbox.report(report);
      }
    } catch (error) {
      throw new Error(`Couldn't find a package.json`, error);
    }
  }
}

NotAllowedPackages.meta = {
  category: 'Security',
  description: 'Not allowed dependencies',
  recommended: true,
  docsUrl: docs.getURL('not-allowed-packages')
};

module.exports = NotAllowedPackages;

'use strict';

const path = require('path');
const requireIndex = require('requireindex');

const Adviser = require('adviser');

class Dependencies extends Adviser.Plugin {
  constructor(settings) {
    super(settings);

    this.rules = requireIndex(path.join(__dirname, '/rules'));
  }
}

Dependencies.meta = {
  description: 'Rules related to package.json dependencies',
  recommended: true
};

module.exports = Dependencies;

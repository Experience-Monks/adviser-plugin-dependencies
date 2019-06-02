'use strict';

const REPO_URL = 'https://github.com/jam3/adviser-plugin-dependencies';

function getURL(ruleName) {
  return `${REPO_URL}/tree/master/docs/rules/${ruleName}.md`;
}

module.exports = {
  getURL
};

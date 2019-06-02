'use strict';

const LicenseWhitelist = require('../src/rules/licenses-whitelist');

const licensewhitelist = new LicenseWhitelist();

licensewhitelist.run();

// describe('Min Vulnerabilities rule', () => {
//   test('sample test', () => {
//     expect(1).toBe(1);
//   });
// });

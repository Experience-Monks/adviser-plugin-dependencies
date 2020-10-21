'use strict';

// const path = require('path');
// const SupiciousPackages = require('../src/rules/suspicious-packages');
// const mockContext = {
//   options: {
//     whitelist: []
//   }
// };
// const supiciousPackages = new SupiciousPackages(mockContext);
// const mockPacakgeJson = {
//   dependencies: {
//     'dep-1': '^0.5.1',
//     'dep-2': '^6.0.5',
//     'dep-3': '^0.8.0'
//   },
//   devDependencies: {
//     'dev-dep-1': '^0.5.1',
//     'dev-dep-2': '^6.0.5',
//     'dev-dep-3': '^0.8.0'
//   }
// };

// const getArrOfDependencies = (deps = {}) => Object.keys(deps).map(key => key);

describe('Supicious Packages', () => {
  //   test('generate package names from package.json', () => {
  //     expect(supiciousPackages._getPackages(mockPacakgeJson)).toEqual([
  //       ...getArrOfDependencies(mockPacakgeJson.dependencies),
  //       ...getArrOfDependencies(mockPacakgeJson.devDependencies)
  //     ]);
  //   });
  // test('ensure that function that generates star is returning a valid value', async () => {
  //   const testPackageName = 'adviser';
  //   expect(await supiciousPackages._genPackageStars(testPackageName)).not.toBeNaN();
  // });
  //   test('ensure that function that generates download is returning a valid value', async () => {
  //     const testPackageName = 'adviser';
  //     expect(await supiciousPackages._genDownloadCount(testPackageName)).not.toBeNaN();
  //   });
  //   test('ensure that function that generates last updated is returning a valid value', async () => {
  //     const testPackageName = 'adviser';
  //     expect(await supiciousPackages._genPackageLastUpdated(testPackageName)).not.toBeNaN();
  //   });
  //   test('ensure that function that generates maintainers is returning a valid value', async () => {
  //     const testPackageName = 'adviser';
  //     expect(await supiciousPackages._genPackageMaintainers(testPackageName)).not.toBeNaN();
  //   });
  //   test('ensure that function that generates open issues is returning a valid value', async () => {
  //     const testPackageName = 'adviser';
  //     expect(await supiciousPackages._genPackageOpenIssues(testPackageName)).not.toBeNaN();
  //   });
  //   test('ensure that function that generates watchers is returning a valid value', async () => {
  //     const testPackageName = 'adviser';
  //     expect(await supiciousPackages._genPackageWatchers(testPackageName)).not.toBeNaN();
  //   });
  //   test('ensure that function that generates forks is returning a valid value', async () => {
  //     const testPackageName = 'adviser';
  //     expect(await supiciousPackages._genPackageForks(testPackageName)).not.toBeNaN();
  //   });
});

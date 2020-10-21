'use strict';

// const path = require('path');
const SupiciousPackages = require('../src/rules/suspicious-packages');
const mockContext = {
  options: {
    whitelist: []
  }
};
const supiciousPackages = new SupiciousPackages(mockContext);
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

  test('ensure that function that generates star is returning a valid value', async () => {
    const testPackageName = 'adviser';
    expect(await supiciousPackages._genPackageStars(testPackageName)).not.toBeNaN();
  });

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

  //   test('returns an empty array if dependancies are missing from package.json', () => {
  //     const arrayOfDepNames = [];
  //     const mockPackageJson = {};

  //     expect(packageSize._getDependencyNames(mockPackageJson)).toEqual(arrayOfDepNames);
  //   });

  //   test('returns version number when available', () => {
  //     const mockDirectoryFragments = [__dirname, 'data', 'package-size', 'mock_node_modules'];
  //     const mockNames = ['fake-package-a', 'fake-package-b', 'fake-package-c'];
  //     const mockVersionObjects = [
  //       { name: 'fake-package-a', version: '0.1.0' },
  //       { name: 'fake-package-b', version: '0.2.0' },
  //       { name: 'fake-package-c', version: '0.3.0' }
  //     ];

  //     expect(packageSize._extractDependencyVersions(mockDirectoryFragments, mockNames)).toEqual(mockVersionObjects);
  //   });

  //   test('returns "latest" when version number not available', () => {
  //     const mockDirectoryFragments = [__dirname, 'data', 'package-size', 'wrong_path'];
  //     const mockNames = ['fake-package-a', 'fake-package-b', 'fake-package-c'];
  //     const mockVersionObjects = [
  //       { name: 'fake-package-a', version: 'latest' },
  //       { name: 'fake-package-b', version: 'latest' },
  //       { name: 'fake-package-c', version: 'latest' }
  //     ];

  //     expect(packageSize._extractDependencyVersions(mockDirectoryFragments, mockNames)).toEqual(mockVersionObjects);
  //   });

  //   test('returns gzip size size when available', async () => {
  //     const rawBytesGzip = 123456;
  //     const kiloBytesGzip = (rawBytesGzip / 1000).toFixed(2);
  //     const mockStatBuilder = () => Promise.resolve({ gzip: rawBytesGzip });
  //     const mockPackages = [
  //       { name: 'fake-package-a', version: '0.1.0' },
  //       { name: 'fake-package-b', version: '0.2.0' },
  //       { name: 'fake-package-c', version: '0.3.0' }
  //     ];
  //     const mockStatObjects = [
  //       { name: 'fake-package-a', version: '0.1.0', size: kiloBytesGzip },
  //       { name: 'fake-package-b', version: '0.2.0', size: kiloBytesGzip },
  //       { name: 'fake-package-c', version: '0.3.0', size: kiloBytesGzip }
  //     ];
  //     const result = await packageSize._generateDependencyStats(mockStatBuilder, mockPackages);

  //     expect(result).toEqual(mockStatObjects);
  //   });

  //   test('returns null size when gzip not available', async () => {
  //     const mockStatBuilder = () => Promise.resolve({ notGzip: 123 });
  //     const mockPackages = [
  //       { name: 'fake-package-a', version: '0.1.0' },
  //       { name: 'fake-package-b', version: '0.2.0' },
  //       { name: 'fake-package-c', version: '0.3.0' }
  //     ];
  //     const mockStatObjects = [
  //       { name: 'fake-package-a', version: '0.1.0', size: null },
  //       { name: 'fake-package-b', version: '0.2.0', size: null },
  //       { name: 'fake-package-c', version: '0.3.0', size: null }
  //     ];
  //     const result = await packageSize._generateDependencyStats(mockStatBuilder, mockPackages);

  //     expect(result).toEqual(mockStatObjects);
  //   });

  //   test('produces a list of packages where size is missing', async () => {
  //     const mockPackages = [
  //       { name: 'fake-package-a', size: null },
  //       { name: 'fake-package-b', size: 123 },
  //       { name: 'fake-package-c' }
  //     ];
  //     const mockOutput = [{ name: 'fake-package-a', size: null }, { name: 'fake-package-c' }];
  //     expect(packageSize._identifySkips(mockPackages)).toEqual(mockOutput);
  //   });

  //   test('produces an empty array when no packages are missing size', async () => {
  //     const mockPackages = [
  //       { name: 'fake-package-a', size: 987 },
  //       { name: 'fake-package-b', size: 123 },
  //       { name: 'fake-package-c', size: 321 }
  //     ];
  //     const mockOutput = [];

  //     expect(packageSize._identifySkips(mockPackages)).toEqual(mockOutput);
  //   });

  //   test('produces a list of packages where size above the provided threshold', async () => {
  //     const mockPackages = [
  //       { name: 'fake-package-a', size: 987 },
  //       { name: 'fake-package-b', size: 123 },
  //       { name: 'fake-package-c', size: 321 }
  //     ];
  //     const mockOutput = [{ name: 'fake-package-a', size: 987 }];

  //     expect(packageSize._identifyLargePackages(mockPackages, 500)).toEqual(mockOutput);
  //   });

  //   test('produces an empty array when no packages are above the size threshold', async () => {
  //     const mockPackages = [
  //       { name: 'fake-package-a', size: 987 },
  //       { name: 'fake-package-b', size: 123 },
  //       { name: 'fake-package-c', size: 321 }
  //     ];
  //     const mockOutput = [];

  //     expect(packageSize._identifyLargePackages(mockPackages, 1500)).toEqual(mockOutput);
  //   });

  //   test('produces a report of heavy packages', async () => {
  //     const mockPackages = [
  //       { name: 'fake-package-a', size: 987 },
  //       { name: 'fake-package-b', size: 123 },
  //       { name: 'fake-package-c', size: 321 }
  //     ];
  //     const mockOutput = 'Found heavy packages: fake-package-a, fake-package-b, fake-package-c';

  //     expect(packageSize._generateReport(mockPackages)).toEqual(mockOutput);
  //   });

  //   test('produces an empty report when no package identified as heavy', async () => {
  //     const mockPackages = [];
  //     const mockOutput = 'No heavy packages found.';

  //     expect(packageSize._generateReport(mockPackages)).toEqual(mockOutput);
  //   });

  //   test('produces a verbose report of only heavy packages when no skips provided', async () => {
  //     const mockHeavyPackages = [
  //       { name: 'fake-package-a', version: '0.1.0', size: 987 },
  //       { name: 'fake-package-b', version: '0.2.0', size: 123 },
  //       { name: 'fake-package-c', version: '0.3.0', size: 321 }
  //     ];
  //     const mockOutput = `Found heavy packages:    \n   - fake-package-a 0.1.0: 987 kb \n   - fake-package-b 0.2.0: 123 kb \n   - fake-package-c 0.3.0: 321 kb \n`;

  //     expect(packageSize._generateVerboseReport(mockHeavyPackages)).toEqual(mockOutput);
  //   });

  //   test('produces a verbose report of only skips when no heavy packages provided', async () => {
  //     const mockHeavyPackages = [];
  //     const mockSkipPackages = [
  //       { name: 'fake-package-d', version: '0.4.0', size: null },
  //       { name: 'fake-package-e', version: '0.5.0', size: null },
  //       { name: 'fake-package-f', version: '0.6.0', size: null }
  //     ];
  //     const mockOutput = `No heavy packages found. \n  Skipped packages:    \n   - fake-package-d \n   - fake-package-e \n   - fake-package-f \n`;

  //     expect(packageSize._generateVerboseReport(mockHeavyPackages, mockSkipPackages)).toEqual(mockOutput);
  //   });

  //   test('produces a verbose report of heavy packages and skips', async () => {
  //     const mockHeavyPackages = [
  //       { name: 'fake-package-a', version: '0.1.0', size: 987 },
  //       { name: 'fake-package-b', version: '0.2.0', size: 123 },
  //       { name: 'fake-package-c', version: '0.3.0', size: 321 }
  //     ];
  //     const mockSkipPackages = [
  //       { name: 'fake-package-d', version: '0.4.0', size: null },
  //       { name: 'fake-package-e', version: '0.5.0', size: null },
  //       { name: 'fake-package-f', version: '0.6.0', size: null }
  //     ];
  //     const mockOutput = `Found heavy packages:    \n   - fake-package-a 0.1.0: 987 kb \n   - fake-package-b 0.2.0: 123 kb \n   - fake-package-c 0.3.0: 321 kb \n \n  Skipped packages:    \n   - fake-package-d \n   - fake-package-e \n   - fake-package-f \n`;

  //     expect(packageSize._generateVerboseReport(mockHeavyPackages, mockSkipPackages)).toEqual(mockOutput);
  //   });

  //   test('produces a empty verbose report when no heavy packages or skips provided', async () => {
  //     const mockHeavyPackages = [];
  //     const mockSkipPackages = [];
  //     const mockOutput = 'No heavy packages found.';

  //     expect(packageSize._generateVerboseReport(mockHeavyPackages, mockSkipPackages)).toEqual(mockOutput);
  //   });
});

'use strict';

const axios = require('axios');
jest.mock('axios');

const SupiciousPackages = require('../src/rules/suspicious-packages');
const mockContext = {
  options: {
    whitelist: []
  }
};
const supiciousPackages = new SupiciousPackages(mockContext);

const getArrOfDependencies = (deps = {}) => Object.keys(deps).map(key => key);

describe('Supicious Packages', () => {
  describe('General Testing', () => {
    const mockPacakgeJson = require('./data/suspicious-packages/mock-packages.json');
    test('generate package names from package.json', () => {
      expect(supiciousPackages._getPackages(mockPacakgeJson)).toEqual([
        ...getArrOfDependencies(mockPacakgeJson.dependencies),
        ...getArrOfDependencies(mockPacakgeJson.devDependencies)
      ]);
    });
    test('whitelist option is working', () => {
      const testDep = Object.keys(mockPacakgeJson.dependencies)[0];
      mockContext.options.whitelist.push(testDep);
      const supiciousPackages = new SupiciousPackages(mockContext);
      expect(supiciousPackages._getPackages(mockPacakgeJson)).not.toContain(testDep);
    });
    test('indicators option is working', () => {
      const indicator = { stars: 10 };
      mockContext.options.indicators = indicator;
      const supiciousPackages = new SupiciousPackages(mockContext);
      expect(supiciousPackages.context.options.indicators.stars).toEqual(10);
    });
  });

  describe('Verify api.npms.io dependant logic', () => {
    const res = require('./data/suspicious-packages/mock_api_responses/api-npms-response.json');
    beforeAll(() => {
      axios.mockResolvedValue(Promise.resolve({ data: res }));
    });
    afterAll(() => {
      axios.mockReset();
    });
    test('verify api is called', async () => {
      await supiciousPackages.packageData('dep-1');
      expect(axios).toHaveBeenCalledTimes(1);
    });
    test('stars count is generated', async () => {
      expect(await supiciousPackages._genPackageStars('dep-1')).toEqual(res.collected.github.starsCount);
    });
    test('maintainer count is generated', async () => {
      expect(await supiciousPackages._genPackageMaintainers('dep-1')).toEqual(
        res.collected.metadata.maintainers.length
      );
    });
    test('open issues count is generated', async () => {
      expect(await supiciousPackages._genPackageOpenIssues('dep-1')).toEqual(res.collected.github.issues.count);
    });
    test('watchers count is generated', async () => {
      expect(await supiciousPackages._genPackageWatchers('dep-1')).toEqual(res.collected.github.subscribersCount);
    });
    test('fork count is generated', async () => {
      expect(await supiciousPackages._genPackageForks('dep-1')).toEqual(res.collected.github.forksCount);
    });
  });

  describe('Verify registry.npmjs.org dependant logic', () => {
    const res = require('./data/suspicious-packages/mock_api_responses/registry-npmjs-response.json');
    afterAll(() => {
      axios.mockReset();
    });
    test('verify call to api is made', async () => {
      axios.mockResolvedValue(Promise.resolve({ data: res }));
      await supiciousPackages._genPackageLastUpdated('dep-1');
      expect(axios).toHaveBeenCalledTimes(1);
    });
    test('last updated value is generated', async () => {
      const today = new Date();
      const monthAgo = new Date(today.setMonth(today.getMonth() - 1));
      axios.mockResolvedValue(Promise.resolve({ data: { time: { modified: monthAgo } } }));
      expect(await supiciousPackages._genPackageLastUpdated('dep-1')).toBeCloseTo(1.07);
    });
  });

  describe('Verify api.npmjs.org dependant logic', () => {
    const res = require('./data/suspicious-packages/mock_api_responses/api-npmjs-response.json');
    beforeAll(() => {
      axios.mockResolvedValue(Promise.resolve({ data: res }));
    });
    test('verify call to api is made', async () => {
      await supiciousPackages._genDownloadCount('dep-1');
      expect(axios).toHaveBeenCalledTimes(1);
    });
    test('download count is generated', async () => {
      expect(await supiciousPackages._genDownloadCount('dep-1')).toEqual(res.downloads);
    });
  });
});

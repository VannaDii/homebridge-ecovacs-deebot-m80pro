import { ApiClient } from '../../src/ecovacs/apiClient';
import { Config } from '../../src/ecovacs/types';

it('Create apiClient', () => {
  expect(new ApiClient()).not.toBeNull();
});

it('Verify default config when none', () => {
  const client = new ApiClient();
  const configDef = client.getConfig();
  expect(configDef).toEqual(<Config>{});
});

it('Verify config saves and returns what saved', () => {
  let configGot: Config;
  let client = new ApiClient();
  const configVal: Config = {
    continent: 'na',
    country: 'us',
    deviceId: Date.now().toString(),
    email: 'user@domain.tld',
    passwordHash: 'lkajsdbnlkasjdnfbals',
  };

  expect(() => client.setConfig(configVal)).not.toThrow();
  expect(() => (configGot = client.getConfig())).not.toThrow();
  expect(configGot).toEqual(configVal);

  client = new ApiClient();
  expect(() => (configGot = client.getConfig())).not.toThrow();
  expect(configGot).toEqual(configVal);
});

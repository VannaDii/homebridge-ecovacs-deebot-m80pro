import { ApiClient } from '../../src/ecovacs/apiClient';
import { Config } from '../../src/ecovacs/types';

it('Create apiClient', () => {
  expect(new ApiClient()).not.toBeNull();
});

it('Check apiClient config', () => {
  const client = new ApiClient();
  const configDef = client.getConfig();
  const configVal: Config = {
    continent: 'na',
    country: 'us',
    deviceId: Date.now().toString(),
    email: 'user@domain.tld',
    passwordHash: 'lkajsdbnlkasjdnfbals',
  };
  expect(() => {
    client.setConfig(configVal);
    return 0;
  }).not.toThrow();
  expect(client.getConfig()).toEqual(configVal);
  expect(configDef).not.toEqual(configVal);
});

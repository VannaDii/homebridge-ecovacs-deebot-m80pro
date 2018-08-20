import { writeFileSync } from 'fs';
import { files } from '../mocks/setup';
import init from '../src/index';

it('Test the homebridge entrypoint for the plugin', () => {
  writeFileSync('~/.homebridge/config.json', files.homebridge.basicConfig);

  const homebridge = require('homebridge');
  expect(() => init(homebridge)).not.toThrow();
});

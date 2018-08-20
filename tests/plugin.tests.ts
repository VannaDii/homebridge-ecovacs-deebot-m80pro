import { Plugin } from '../src/plugin';
import { writeFileSync } from 'fs';
import { files } from '../mocks/setup';

it('Instantiates the plugin', () => {
  writeFileSync('~/.homebridge/config.json', files.homebridge.basicConfig);

  const homebridge = require('homebridge');
  const plugin: Plugin = new Plugin(homebridge);
  expect(() => plugin.initialize()).not.toThrow();
});

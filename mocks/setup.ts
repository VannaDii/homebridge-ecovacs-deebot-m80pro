import { PathLike, readFileSync } from 'fs';
import { resolve } from 'path';

const basePath = resolve(__dirname, '..');

export const files = {
  homebridge: {
    package: require
      .requireActual('fs')
      .readFileSync(`${basePath}/node_modules/homebridge/package.json`, 'utf-8'),
    basicConfig: require
      .requireActual('fs')
      .readFileSync(`${basePath}/tests/config/homebridge.basic.json`, 'utf-8'),
  },
};

jest
  .resetAllMocks()
  .resetModules()
  .mock('fs', () => {
    const original = require.requireActual('fs');
    const _fileSystem: { [id: string]: any } = {};
    return {
      ...original, //Pass down all the exported objects
      existsSync: jest.fn((path: PathLike) => {
        return path.toString() in _fileSystem;
      }),
      mkdirSync: jest.fn((path: PathLike) => {
        if (!(path.toString() in _fileSystem)) {
          _fileSystem[path.toString()] = undefined;
        }
      }),
      writeFileSync: jest.fn((path: PathLike, data: string) => {
        _fileSystem[path.toString()] = data;
      }),
      readFileSync: jest.fn((path: string, options: string) => {
        return _fileSystem[path];
      }),
    };
  })
  .mock('hap-nodejs', () => {
    const original = require.requireActual('hap-nodejs');
    return {
      ...original,
    };
  })
  .mock('homebridge', () => {
    const fsMock = require.requireMock('fs');
    const path = require('path');
    const os = require('os');

    // Write the package.json for homebridge to the mocked fs
    fsMock.writeFileSync(
      path.join(basePath, 'node_modules', 'homebridge', 'package.json'),
      files.homebridge.package
    );

    const original = require.requireActual('homebridge');

    return {
      ...original, //Pass down all the exported objects
    };
  });

import { Config } from './types';
import { homedir } from 'os';
import { writeFileSync, readFileSync, mkdirSync, existsSync, PathLike } from 'fs';
import { join, basename } from 'path';

export class ApiClient {
  private _config: Config;
  private _configPath: PathLike = ApiClient.getConfigPath();

  constructor() {
    this._config = ApiClient.readConfig(this._configPath);
  }

  getConfig(): Config {
    return this._config;
  }

  setConfig(config: Config): void {
    this._config = config;
    ApiClient.saveConfig(this._configPath, this._config);
  }

  private static readConfig(path: PathLike): Config {
    if (!existsSync(path)) {
      return <Config>{};
    }
    const data = readFileSync(path, { encoding: 'utf-8' });
    return <Config>JSON.parse(data);
  }

  private static saveConfig(path: PathLike, config: Config): void {
    writeFileSync(ApiClient.ensureDirs(path), JSON.stringify(config));
  }

  private static getConfigPath(): PathLike {
    return ApiClient.ensureDirs(
      join(homedir(), '.config', 'homebridge-ecovacs-deebot-m80pro.json')
    );
  }

  private static ensureDirs(path: PathLike): PathLike {
    const basePath = basename(path.toString());
    if (!existsSync(basePath)) {
      mkdirSync(basePath);
    }
    return path;
  }
}

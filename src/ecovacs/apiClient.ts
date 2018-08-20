import { Config } from './types';
import { homedir } from 'os';
import { writeFileSync, readFileSync, mkdirSync, existsSync, PathLike } from 'fs';
import { join, dirname } from 'path';

export class ApiClient {
  private _config: Config;
  private _configPath: string;

  constructor() {
    this._configPath = ApiClient.getConfigPath();
    this._config = ApiClient.readConfig(this._configPath);
  }

  getConfig(): Config {
    return this._config;
  }

  setConfig(config: Config): void {
    this._config = config;
    ApiClient.saveConfig(this._configPath, this._config);
  }

  private static readConfig(path: string): Config {
    if (!existsSync(path)) {
      return <Config>{};
    }
    const data = readFileSync(path, 'r');
    return <Config>JSON.parse(data);
  }

  private static saveConfig(path: string, config: Config): void {
    writeFileSync(ApiClient.ensureDirs(path), JSON.stringify(config));
  }

  private static getConfigPath(): string {
    return ApiClient.ensureDirs(
      join(homedir(), '.config/homebridge-ecovacs', 'deebot-m80pro.json')
    );
  }

  private static ensureDirs(path: string): string {
    const basePath = dirname(path);
    if (!existsSync(basePath)) {
      mkdirSync(basePath);
    }
    return path;
  }
}

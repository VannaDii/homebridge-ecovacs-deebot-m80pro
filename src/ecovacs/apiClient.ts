import { Config } from './types';
import { homedir } from 'os';
import { writeFileSync, readFileSync, mkdirSync, existsSync } from 'fs';
import { join, basename } from 'path';

export class ApiClient {
  private _config: Config;
  private _configPath: string = ApiClient.getConfigPath();

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

  private static readConfig(path: string): Config {
    if (!existsSync(path)) {
      return <Config>{};
    }
    const data = readFileSync(path, { encoding: 'utf-8' });
    return <Config>JSON.parse(data);
  }

  private static saveConfig(path: string, config: Config): void {
    writeFileSync(path, JSON.stringify(config));
  }

  private static getConfigPath(): string {
    const path = join(homedir(), '.config', 'homebridge-ecovacs-deebot-m80pro.json');
    const basePath = basename(path);
    if (!existsSync(basePath)) {
      mkdirSync(basePath);
    }
    return path;
  }
}

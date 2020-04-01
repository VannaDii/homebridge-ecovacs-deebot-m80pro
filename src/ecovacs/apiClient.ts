import { homedir } from 'os';
import * as crypto from 'crypto';
import { join, dirname } from 'path';
import * as geodata from 'countries-list';
import { writeFileSync, readFileSync, mkdirSync, existsSync } from 'fs';
import * as request from 'request-promise-native';
import {
  ApiConfig,
  ApiMeta,
  DefautlValues,
  ApiPaths,
  ApiLoginInfo,
  ApiAuthCode,
  ApiAuthToken,
  ApiParams,
  ApiIpInfo,
} from './apiTypes';

const md5 = (contents: string) =>
  crypto
    .createHash('md5')
    .update(new Buffer(contents, 'utf8'))
    .digest('hex');

export class ApiClient {
  private _config: ApiConfig;
  private _configPath: string;
  private _apiMeta: ApiMeta;

  constructor(accountId: string, password: string) {
    const deviceId = md5((Date.now() / 1000).toString());
    this._apiMeta = {
      lang: DefautlValues.lang,
      deviceId: deviceId,
      appCode: DefautlValues.appCode,
      appVersion: DefautlValues.appVersion,
      channel: DefautlValues.appChannel,
      deviceType: DefautlValues.deviceType,
      resource: deviceId.slice(0, 8),
      accountId: accountId,
      passwordHash: md5(password),
      loginAccessToken: null,
      userAccessToken: null,
      continent: null,
      authCode: null,
      country: null,
      uid: null,
    };
    this._configPath = ApiClient.getConfigPath();
    this._config = ApiClient.readConfig(this._configPath);
  }

  async authenticate(): Promise<void> {
    if (!this._apiMeta.country || !this._apiMeta.continent) {
      const ipInfo = await ApiClient.getIpInfo();
      this._apiMeta.country = ipInfo.country.toLowerCase();
      this._apiMeta.continent = geodata.countries[ipInfo.country.toUpperCase()].continent;
    }
    const loginInfo = await ApiClient.callApiMain<ApiLoginInfo>(
      ApiPaths.main.userLogin,
      this._apiMeta,
      {
        account: ApiClient.encrypt(this._apiMeta.accountId),
        password: ApiClient.encrypt(this._apiMeta.passwordHash),
      }
    );
    this._apiMeta.uid = loginInfo.uid;
    this._apiMeta.loginAccessToken = loginInfo.access_token;

    const authInfo = await ApiClient.callApiMain<ApiAuthCode>(
      ApiPaths.main.userGetAuthCode,
      this._apiMeta,
      {
        uid: this._apiMeta.uid,
        accessToken: this._apiMeta.loginAccessToken,
      }
    );
    this._apiMeta.authCode = authInfo.authCode;

    const tokenInfo = await ApiClient.callApiUser<ApiAuthToken>(
      ApiPaths.user.loginByItToken,
      this._apiMeta,
      {
        userId: this._apiMeta.uid,
        token: this._apiMeta.authCode,
      }
    );
    this._apiMeta.userAccessToken = tokenInfo.token;
  }

  getConfig(): ApiConfig {
    return this._config;
  }

  setConfig(config: ApiConfig): void {
    this._config = config;
    ApiClient.saveConfig(this._configPath, this._config);
  }

  private static async callApiMain<T>(path: string, meta: ApiMeta, params: ApiParams): Promise<T> {
    params['requestId'] = md5((Date.now() / 1000).toString());
    const mainUrl = DefautlValues.urlFormatMainApi(meta) + '/' + path;
    const signedQuery = ApiClient.sign(meta, params);
    console.log(`Requesting ${mainUrl} with ${JSON.stringify(signedQuery)}`);
    const resp = await request({
      uri: mainUrl,
      qs: signedQuery,
      json: true,
    });
    const code = resp.code;
    switch (code) {
      case '0000':
        return <T>resp.data;
      case '0001':
        throw Error('Operation failed.');
      case '0002':
        throw Error(
          {
            接口鉴权参数缺失: 'Authentication parameters are missing.',
            接口鉴权失败: 'Authentication failure.',
          }[resp.msg]
        );
      case '1005':
        throw Error('Invalid email or password.');
      default:
        throw Error(
          `Error ${resp.code}: ${resp.msg} calling ${mainUrl} with ${JSON.stringify(signedQuery)}`
        );
    }
  }

  private static async callApiUser<T>(path: string, meta: ApiMeta, params: ApiParams): Promise<T> {
    params['todo'] = path;
    const userUrl = DefautlValues.urlFormatUserApi(meta);
    const resp = await request({
      method: 'POST',
      uri: userUrl,
      body: params,
      json: true,
    });
    if (resp.result === 'ok') {
      return resp;
    } else {
      throw Error(
        `Error ${resp.errno}: ${resp.error} calling ${userUrl} with ${JSON.stringify(params)}`
      );
    }
  }

  private static async getIpInfo(): Promise<ApiIpInfo> {
    const resp = await request({ uri: 'http://ipinfo.io/json', json: true });
    return <ApiIpInfo>resp;
  }

  private static encrypt(value: string): string {
    var data = new Buffer(value, 'utf8');
    var encrypted = crypto.publicEncrypt(DefautlValues.publicKey, data);
    var result = encrypted.toString('base64');

    return result;
  }

  private static sign(meta: ApiMeta, params: ApiParams): ApiParams {
    const result = JSON.parse(JSON.stringify(params));
    result['authTimespan'] = Math.floor(new Date().getTime() / 1000);
    result['authTimeZone'] = 'GMT-8';

    const signOn = {
      country: meta.country,
      lang: meta.lang,
      deviceId: meta.deviceId,
      appCode: meta.appCode,
      appVersion: meta.appVersion,
      channel: meta.channel,
      deviceType: meta.deviceType,
    };

    let signOnArray = Object.keys(signOn).map((k) => `${k}=${signOn[k]}`);
    signOnArray.push(...Object.keys(result).map((k) => `${k}=${result[k]}`));

    const signOnText = `${DefautlValues.clientKey}${signOnArray.join('')}${DefautlValues.secret}`;

    result['authAppkey'] = DefautlValues.clientKey;
    result['authSign'] = md5(signOnText);

    console.log(`Signed ${JSON.stringify(result)} as ${signOnArray.join('')} yields ${signOnText}`);

    return result;
  }

  private static readConfig(path: string): ApiConfig {
    if (!existsSync(path)) {
      return <ApiConfig>{};
    }
    const data = readFileSync(path, 'r');
    return <ApiConfig>JSON.parse(data);
  }

  private static saveConfig(path: string, config: ApiConfig): void {
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

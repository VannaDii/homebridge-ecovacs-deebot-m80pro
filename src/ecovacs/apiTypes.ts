export interface ApiConfig {
  email: string;
  passwordHash: string;
  deviceId: string;
  country: string;
  continent: string;
}

export interface ApiMeta {
  country: string;
  lang: string;
  deviceId: string;
  appCode: string;
  appVersion: string;
  channel: string;
  deviceType: string;
  resource: string;
  continent: string;
  accountId: string;
  passwordHash: string;
  uid: string;
  loginAccessToken: string;
  authCode: string;
  userAccessToken: string;
}

export interface ApiLoginInfo {
  uid: string;
  access_token: string;
}

export interface ApiAuthCode {
  authCode: string;
}

export interface ApiAuthToken {
  token: string;
}

export interface ApiIpInfo {
  ip: string;
  city: string;
  region: string;
  country: string;
  loc: string;
  postal: string;
  phone: string;
  org: string;
}

export type ApiParams = { [id: string]: any };

export class ApiPaths {
  public static main = {
    userLogin: 'user/login',
    userGetAuthCode: 'user/getAuthCode',
  };
  public static user = {
    loginByItToken: 'loginByItToken',
  };
}

export class DefautlValues {
  public static lang: string = 'en';
  public static appCode: string = 'i_eco_e';
  public static appVersion: string = '1.3.5';
  public static appChannel: string = 'c_googleplay';
  public static deviceType: string = '1';

  public static clientKey = 'eJUWrzRv34qFSaYk';
  public static secret = 'Cyu5jcR4zyK6QEPn1hdIGXB5QIDAQABMA0GC';
  public static publicKey = `-----BEGIN CERTIFICATE-----
MIIB/TCCAWYCCQDJ7TMYJFzqYDANBgkqhkiG9w0BAQUFADBCMQswCQYDVQQGEwJj
bjEVMBMGA1UEBwwMRGVmYXVsdCBDaXR5MRwwGgYDVQQKDBNEZWZhdWx0IENvbXBh
bnkgTHRkMCAXDTE3MDUwOTA1MTkxMFoYDzIxMTcwNDE1MDUxOTEwWjBCMQswCQYD
VQQGEwJjbjEVMBMGA1UEBwwMRGVmYXVsdCBDaXR5MRwwGgYDVQQKDBNEZWZhdWx0
IENvbXBhbnkgTHRkMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDb8V0OYUGP
3Fs63E1gJzJh+7iqeymjFUKJUqSD60nhWReZ+Fg3tZvKKqgNcgl7EGXp1yNifJKU
NC/SedFG1IJRh5hBeDMGq0m0RQYDpf9l0umqYURpJ5fmfvH/gjfHe3Eg/NTLm7QE
a0a0Il2t3Cyu5jcR4zyK6QEPn1hdIGXB5QIDAQABMA0GCSqGSIb3DQEBBQUAA4GB
ANhIMT0+IyJa9SU8AEyaWZZmT2KEYrjakuadOvlkn3vFdhpvNpnnXiL+cyWy2oU1
Q9MAdCTiOPfXmAQt8zIvP2JC8j6yRTcxJCvBwORDyv/uBtXFxBPEC6MDfzU2gKAa
HeeJUWrzRv34qFSaYkYta8canK+PSInylQTjJK9VqmjQ
-----END CERTIFICATE-----`;
  public static urlFormatMainApi = (meta: ApiMeta) =>
    `https://eco-${meta.country}-api.ecovacs.com/v1/private/${meta.country}/${meta.lang}/${
      meta.deviceId
    }/${meta.appCode}/${meta.appVersion}/${meta.channel}/${meta.deviceType}`;
  public static urlFormatUserApi = (meta: ApiMeta) =>
    `https://users-${meta.continent}.ecouser.net:8000/user.do`;
  public static realm = 'ecouser.net';
}

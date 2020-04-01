import { API } from 'homebridge';
import { Plugin } from './plugin';
import { ApiClient } from './ecovacs/apiClient';

var pluginInstance: Plugin;

/* export default function init(homebridge: API) {
  pluginInstance = new Plugin(homebridge);
  pluginInstance.initialize();
} */

export default function init() {
  const client = new ApiClient('gio@palacino.net', 'Got14YaNow');
  client.authenticate();
}

init();

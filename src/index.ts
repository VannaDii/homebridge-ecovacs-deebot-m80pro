import { API } from 'homebridge';
import { Plugin } from './plugin';

var pluginInstance: Plugin;

export default function init(homebridge: API) {
  pluginInstance = new Plugin(homebridge);
  pluginInstance.initialize();
}

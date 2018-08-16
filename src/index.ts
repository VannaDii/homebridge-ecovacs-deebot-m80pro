import { API } from 'homebridge';
import { Plugin } from './plugin';

var pluginInstance: Plugin;

export default function(homebridge: API) {
  pluginInstance = new Plugin(homebridge);
  try {
    pluginInstance.initialize();
  } catch (e) {
    console.error(e);
  }
}

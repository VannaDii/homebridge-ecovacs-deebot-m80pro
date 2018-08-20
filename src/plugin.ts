import { API } from 'homebridge';

export class Plugin {
  private homebridge: API;
  private accessory;
  private service;
  private characteristic;
  private uUIDGen;

  constructor(homebridge: API) {
    this.homebridge = homebridge;
  }

  initialize() {
    // Accessory must be created from PlatformAccessory Constructor
    this.accessory = this.homebridge.platformAccessory;

    // Service and Characteristic are from hap-nodejs
    /* this.service = this.homebridge.hap.Service;
    this.characteristic = this.homebridge.hap.Characteristic;
    this.uUIDGen = this.homebridge.hap.uuid; */
  }
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Plugin {
    constructor(homebridge) {
        this.homebridge = homebridge;
    }
    initialize() {
        this.accessory = this.homebridge.platformAccessory;
        this.service = this.homebridge.hap.Service;
        this.characteristic = this.homebridge.hap.Characteristic;
        this.uUIDGen = this.homebridge.hap.uuid;
    }
}
exports.Plugin = Plugin;
//# sourceMappingURL=plugin.js.map
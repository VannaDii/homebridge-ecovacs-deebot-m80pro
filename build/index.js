"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const plugin_1 = require("./plugin");
var pluginInstance;
function default_1(homebridge) {
    pluginInstance = new plugin_1.Plugin(homebridge);
    try {
        pluginInstance.initialize();
    }
    catch (e) {
        console.error(e);
    }
}
exports.default = default_1;
//# sourceMappingURL=index.js.map
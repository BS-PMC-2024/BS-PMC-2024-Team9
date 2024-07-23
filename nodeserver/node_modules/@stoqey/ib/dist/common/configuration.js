"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.get = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/no-var-requires */
const fs_1 = require("fs");
const path = __importStar(require("path"));
require("dotenv").config();
let configuration = null;
const envsToInclude = [
    "ci",
    "env_config_test",
    "ib_host",
    "ib_port",
    "ib_test_account",
    "client_version",
    "max_req_per_second",
];
function readJson(readPath) {
    try {
        const data = (0, fs_1.readFileSync)(readPath, "utf8");
        return JSON.parse(data);
    }
    catch (error) {
        if (error.code !== "ENOENT" ||
            (error.errno !== undefined && error.errno !== -4058 && error.errno !== -2)) {
            throw error;
        }
    }
    return {};
}
function read(file) {
    const filePath = path.resolve(__dirname, "..", "..", "config", `${file}.json`);
    return readJson(filePath);
}
function assignEnvironment(config) {
    const newConfig = config;
    envsToInclude.forEach((key) => {
        const lc = key.toLowerCase();
        const uc = key.toUpperCase();
        newConfig[lc] = process.env[uc] || config[lc];
    });
    return newConfig;
}
function loadEnvironmentSpecific(config, environment) {
    let newConfig = config;
    if (environment) {
        const conf = read(environment);
        if (conf) {
            newConfig = {
                ...newConfig,
                ...conf,
            };
        }
    }
    return newConfig;
}
const ensureInteger = (fields, config) => fields.forEach((field) => {
    const value = config[field];
    if (typeof value === "string") {
        config[field] = parseInt(value, 10);
    }
});
function load() {
    const nodeEnvironment = process.env.NODE_ENV;
    // load default config
    let config = read("default");
    // load local config
    config = loadEnvironmentSpecific(config, "local");
    // load environment specific config
    config = loadEnvironmentSpecific(config, nodeEnvironment);
    // load config from env variables
    config = assignEnvironment(config);
    config.environment = nodeEnvironment || "local";
    config.isProduction = nodeEnvironment === "production";
    config.isStaging = nodeEnvironment === "staging";
    config.isDevelopment = nodeEnvironment === "development";
    config.isTest = nodeEnvironment === "test";
    config.isLocal = !nodeEnvironment;
    config.ci = config.ci || process.env.CIRCLECI;
    const intFields = [
        "ib_port",
        "default_client_id",
        "client_version",
        "max_req_per_second",
    ];
    ensureInteger(intFields, config);
    return config;
}
function get() {
    if (!configuration) {
        configuration = load();
    }
    return configuration;
}
exports.get = get;
configuration = load();
exports.default = configuration;
//# sourceMappingURL=configuration.js.map
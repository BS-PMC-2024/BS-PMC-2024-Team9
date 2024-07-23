"use strict";
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const colors_1 = __importDefault(require("colors"));
const util = __importStar(require("util"));
const timeStamp = () => `[${new Date().toISOString().substring(11, 19)}]`;
const debug = (...args) => {
    if (process.env.NODE_ENV === "development") {
        const newArgs = [timeStamp(), "Debug:", ...args].map((x) => colors_1.default.grey(x));
        console.debug(...newArgs);
    }
};
const info = (...args) => {
    const newArgs = [timeStamp(), " Info:", ...args].map((x) => colors_1.default.green(x));
    console.log(...newArgs);
};
const warn = (...args) => {
    const newArgs = [timeStamp(), " Warn:", ...args].map((x) => colors_1.default.yellow(x));
    console.warn(...newArgs);
};
const error = (...args) => {
    // Prevent hiding of any stack traces
    const newArgs = [timeStamp(), "Error:", ...args].map((x) => colors_1.default.bold.red(typeof x == "string" ? x : util.inspect(x, { showHidden: false, depth: null })));
    console.error(...newArgs);
};
const testError = (...args) => {
    // Prevent hiding of any stack traces
    const newArgs = args.map((x) => colors_1.default.bold.red(util.inspect(x, { showHidden: false, depth: 3 })));
    console.error(...newArgs);
};
exports.default = {
    debug,
    info,
    warn,
    error,
    testError,
};
//# sourceMappingURL=logger.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../../..");
const configuration_1 = __importDefault(require("../../../common/configuration"));
describe("IBApi market scanner tests", () => {
    jest.setTimeout(10 * 1000);
    let ib;
    const clientId = Math.floor(Math.random() * 32766) + 1; // ensure unique client
    beforeEach(() => {
        ib = new __1.IBApi({
            host: configuration_1.default.ib_host,
            port: configuration_1.default.ib_port,
            clientId,
        });
    });
    afterEach(() => {
        if (ib) {
            ib.disconnect();
            ib = undefined;
        }
    });
    test("Scanner parameters", (done) => {
        ib.on(__1.EventName.scannerParameters, (xml) => {
            const match = '<?xml version="1.0" encoding="UTF-8"?>'; // eslint-disable-line quotes
            expect(xml.substring(0, match.length)).toEqual(match);
            ib.disconnect();
        })
            .on(__1.EventName.disconnected, () => {
            done();
        })
            .on(__1.EventName.error, (err, code, reqId) => {
            if (reqId !== -1)
                done(`[${reqId}] ${err.message} (#${code})`);
        });
        ib.connect().reqScannerParameters();
    });
    test("Most active US stocks", (done) => {
        const refId = 1;
        ib.once(__1.EventName.nextValidId, (_reqId) => {
            ib.reqScannerSubscription(refId, {
                abovePrice: 1,
                scanCode: __1.ScanCode.MOST_ACTIVE,
                locationCode: __1.LocationCode.STK_US,
                instrument: __1.Instrument.STK,
                numberOfRows: 20,
            });
        })
            .on(__1.EventName.scannerData, (reqId, _rank, _contract, _distance, _benchmark, _projection, _legStr) => {
            expect(reqId).toEqual(refId);
        })
            .on(__1.EventName.scannerDataEnd, (reqId) => {
            expect(reqId).toEqual(refId);
            if (ib)
                ib.disconnect();
        })
            .on(__1.EventName.disconnected, () => {
            done();
        })
            .on(__1.EventName.error, (err, code, reqId) => {
            if (reqId == refId) {
                if (code == __1.ErrorCode.SCANNER_LOW_PRECISION)
                    return;
                done(`[${reqId}] ${err.message} (#${code})`);
            }
        });
        ib.connect();
    });
});
//# sourceMappingURL=market-scanner.test.js.map
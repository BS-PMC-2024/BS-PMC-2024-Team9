"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * This file implement test code for the placeOrder function .
 */
const __1 = require("../../../..");
const configuration_1 = __importDefault(require("../../../../common/configuration"));
const logger_1 = __importDefault(require("../../../../common/logger"));
const contracts_1 = require("../../sample-data/contracts");
describe("CancelOrder", () => {
    jest.setTimeout(20 * 1000);
    let ib;
    let clientId = Math.floor(Math.random() * 32766) + 1; // ensure unique client
    beforeEach(() => {
        ib = new __1.IBApi({
            host: configuration_1.default.ib_host,
            port: configuration_1.default.ib_port,
            clientId: clientId++, // increment clientId for each test so they don't interfere on each other
        });
        // logger.info("IBApi created");
    });
    afterEach(() => {
        if (ib) {
            ib.disconnect();
            ib = undefined;
        }
        // logger.info("IBApi disconnected");
    });
    test("cancelOrder", (done) => {
        let refId;
        const contract = contracts_1.sample_etf;
        const order = {
            orderType: __1.OrderType.LMT,
            action: __1.OrderAction.BUY,
            lmtPrice: 3,
            totalQuantity: 3,
            tif: __1.TimeInForce.DAY,
            outsideRth: false,
            transmit: true,
        };
        let cancelling = false;
        ib.once(__1.EventName.nextValidId, (orderId) => {
            refId = orderId;
            ib.placeOrder(refId, contract, order);
        })
            .on(__1.EventName.orderStatus, (orderId, status, _filled, _remaining, _avgFillPrice, _permId, _parentId, _lastFillPrice, _clientId, _whyHeld, _mktCapPrice) => {
            if (orderId === refId) {
                if (!cancelling &&
                    [__1.OrderStatus.PreSubmitted, __1.OrderStatus.Submitted].includes(status)) {
                    cancelling = true;
                    ib.cancelOrder(refId);
                }
            }
        })
            .on(__1.EventName.error, (error, code, reqId, _advancedOrderReject) => {
            if (reqId === -1) {
                logger_1.default.info(error.message);
            }
            else {
                const msg = `[${reqId}] ${error.message} (Error #${code})`;
                if (error.message.includes("Warning:")) {
                    logger_1.default.warn(msg);
                }
                else if (code == __1.ErrorCode.ORDER_CANCELLED &&
                    reqId == refId &&
                    cancelling) {
                    logger_1.default.info(msg);
                    done();
                }
                else {
                    done(msg);
                }
            }
        });
        ib.connect().reqOpenOrders();
    });
});
//# sourceMappingURL=cancelOrder.test.js.map
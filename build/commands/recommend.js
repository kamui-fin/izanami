"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../utils/utils");
var anilist_1 = __importDefault(require("../utils/anilist"));
var AniRecommender = /** @class */ (function () {
    function AniRecommender(prms) {
        this.name = 'recommend';
        this.description = 'Recommends anime from anilist based on a title';
        this.params = prms;
    }
    AniRecommender.prototype.correctParams = function () {
        var fromAnime = this.params[0];
        var limitRecs = this.params[1];
        if (fromAnime &&
            limitRecs &&
            parseInt(limitRecs) !== NaN &&
            parseInt(limitRecs) < 5 &&
            parseInt(limitRecs) > 0) {
            return true;
        }
        return false;
    };
    AniRecommender.prototype.run = function (msg) {
        return __awaiter(this, void 0, void 0, function () {
            var anilist, reccs, _i, reccs_1, recc, onerec, onemediarecc, embed;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        anilist = new anilist_1.default(this.params[0]);
                        return [4 /*yield*/, anilist.getReccomendations(parseInt(this.params[1]))];
                    case 1:
                        reccs = _a.sent();
                        for (_i = 0, reccs_1 = reccs; _i < reccs_1.length; _i++) {
                            recc = reccs_1[_i];
                            onerec = recc;
                            onemediarecc = onerec.node.mediaRecommendation;
                            onemediarecc.description = utils_1.fixDesc(onemediarecc.description, 300);
                            embed = utils_1.getEmbed(onemediarecc);
                            msg.channel.send({ embed: embed });
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    return AniRecommender;
}());
exports.default = AniRecommender;
//# sourceMappingURL=recommend.js.map
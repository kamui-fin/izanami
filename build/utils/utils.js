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
exports.checkValidCommand = exports.splitCommand = exports.fixDesc = exports.getEmbed = exports.sendGraphQL = void 0;
var axios_1 = __importDefault(require("axios"));
exports.sendGraphQL = function (baseUrl, query, variables) { return __awaiter(void 0, void 0, void 0, function () {
    var res;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, axios_1.default({
                    url: baseUrl,
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                    data: {
                        query: query,
                        variables: variables,
                    },
                })];
            case 1:
                res = _a.sent();
                return [2 /*return*/, res];
        }
    });
}); };
exports.getEmbed = function (media) {
    var embed = {
        title: media.title.native,
        description: media.description,
        url: media.siteUrl,
        color: media.coverImage.color,
        footer: {
            text: "Started " + media.startDate.month + " " + media.startDate.day + ", " + media.startDate.year,
        },
        image: {
            url: media.coverImage.large,
        },
        fields: [
            {
                name: 'Genres',
                value: media.genres.join(', '),
            },
            {
                name: 'Episodes',
                value: media.episodes.toLocaleString(),
            },
            {
                name: 'Favorites',
                value: media.favourites.toLocaleString(),
                inline: true,
            },
            {
                name: 'Average Score',
                value: media.averageScore.toLocaleString(),
                inline: true,
            },
            {
                name: 'Popularity',
                value: media.popularity.toLocaleString(),
                inline: true,
            },
            {
                name: 'Favorites',
                value: media.favourites.toLocaleString(),
                inline: true,
            },
        ],
    };
    return embed;
};
exports.fixDesc = function (text, limitChars) {
    var desc = text.replace(/<br>/g, '');
    if (desc.length > limitChars) {
        desc = desc.slice(0, limitChars) + "...";
    }
    return desc;
};
exports.splitCommand = function (text) {
    var splitted = text.match(/(?:[^\s"]+|"[^"]*")+/g);
    if (splitted) {
        splitted = splitted.filter(function (el) { return el.trim() !== ''; });
    }
    return splitted;
};
exports.checkValidCommand = function (cmd, prefix, commandType) {
    var splittedCommand = exports.splitCommand(cmd);
    var isAnilistCmd = splittedCommand[0].startsWith(prefix + "anilist");
    var isCorrectCmdType = splittedCommand[1] === commandType.name;
    var validParams = commandType.correctParams();
    return validParams && isCorrectCmdType && isAnilistCmd;
};
//# sourceMappingURL=utils.js.map
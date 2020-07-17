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
var axios_1 = __importDefault(require("axios"));
var Anime = /** @class */ (function () {
    function Anime() {
        this.name = 'anime';
        this.description = 'Reccomends anime from anilist based on a title';
    }
    Anime.prototype.getParams = function (msg) {
        var text = msg.content;
        var splitted = text.match(/(?:[^\s"]+|"[^"]*")+/g);
        var idkSplitted = splitted.slice(2);
        idkSplitted = idkSplitted.filter(function (el) { return el.trim() !== ''; });
        if (idkSplitted.length > 2 ||
            idkSplitted.length < 1 ||
            splitted[1] !== this.name ||
            splitted[0] !== '!reccomend') {
            throw new SyntaxError('Invalid arguments');
        }
        return idkSplitted;
    };
    Anime.prototype.run = function (msg) {
        return __awaiter(this, void 0, void 0, function () {
            var params, anilist, reccs, onerec, onemediarecc, desc, embed;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = this.getParams(msg);
                        anilist = new AniList(params[0]);
                        return [4 /*yield*/, anilist.getReccomendations()];
                    case 1:
                        reccs = _a.sent();
                        onerec = reccs[0];
                        onemediarecc = onerec.node.mediaRecommendation;
                        desc = onemediarecc.description;
                        if (desc.length > 200) {
                            desc.slice(0, 200);
                        }
                        console.log(desc);
                        embed = {
                            title: onemediarecc.title.native,
                            description: desc,
                            url: onemediarecc.siteUrl,
                            color: onemediarecc.coverImage.color,
                            footer: {
                                text: "Started " + onemediarecc.startDate.month + " " + onemediarecc.startDate.day + ", " + onemediarecc.startDate.year,
                            },
                            image: {
                                url: onemediarecc.coverImage.large,
                            },
                            fields: [
                                {
                                    name: 'Genres',
                                    value: onemediarecc.genres.join(', '),
                                },
                                {
                                    name: 'Episodes',
                                    value: onemediarecc.episodes.toLocaleString(),
                                },
                                {
                                    name: 'Favorites',
                                    value: onemediarecc.favourites.toLocaleString(),
                                    inline: true,
                                },
                                {
                                    name: 'Average Score',
                                    value: onemediarecc.averageScore.toLocaleString(),
                                    inline: true,
                                },
                                {
                                    name: 'Popularity',
                                    value: onemediarecc.popularity.toLocaleString(),
                                    inline: true,
                                },
                                {
                                    name: 'Favorites',
                                    value: onemediarecc.favourites.toLocaleString(),
                                    inline: true,
                                },
                            ],
                        };
                        msg.channel.send({ embed: embed });
                        return [2 /*return*/];
                }
            });
        });
    };
    return Anime;
}());
var AniList = /** @class */ (function () {
    function AniList(query) {
        this.baseURL = 'https://graphql.anilist.co';
        this.query = query;
    }
    AniList.prototype.getReccomendations = function () {
        return __awaiter(this, void 0, void 0, function () {
            var searchQuery, reccQuery, variables, res, id, basedOfTitle, reccomendations, reccs;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        searchQuery = "\n      query ($txt: String) {\n        Media(search:$txt, type:ANIME){\n          id,\n          title{\n            native\n          }\n        }\n      }\n      ";
                        reccQuery = "\n    query ($id: Int) {\n        Media(id: $id, type: ANIME) {\n          recommendations {\n            edges {\n              node {\n                media {\n                  title {\n                    native\n                  }\n                }\n                mediaRecommendation {\n                  coverImage {\n                    extraLarge\n                    large\n                    medium\n                  }\n                  title {\n                    native\n                  }\n                  siteUrl\n                  description\n                  episodes\n                  genres\n                  averageScore\n                  popularity\n                  favourites\n                  startDate {\n                    year\n                    month\n                    day\n                  }\n                }\n              }\n            }\n          }\n        }\n      }\n      \n      \n      ";
                        variables = {
                            txt: this.query.slice(1, this.query.length),
                        };
                        return [4 /*yield*/, axios_1.default({
                                url: this.baseURL,
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    Accept: 'application/json',
                                },
                                data: {
                                    query: searchQuery,
                                    variables: variables,
                                },
                            })];
                    case 1:
                        res = _a.sent();
                        id = res.data.data.Media.id;
                        basedOfTitle = res.data.data.Media.title.native;
                        return [4 /*yield*/, axios_1.default({
                                url: this.baseURL,
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    Accept: 'application/json',
                                },
                                data: {
                                    query: reccQuery,
                                    variables: {
                                        id: id,
                                    },
                                },
                            })];
                    case 2:
                        reccomendations = _a.sent();
                        reccs = (reccomendations.data.data.Media.recommendations.edges);
                        return [2 /*return*/, reccs];
                }
            });
        });
    };
    return AniList;
}());
exports.default = Anime;
//# sourceMappingURL=anime.js.map
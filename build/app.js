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
var discord_js_1 = __importDefault(require("discord.js"));
var recommend_1 = __importDefault(require("./commands/recommend"));
var help_1 = __importDefault(require("./commands/help"));
var info_1 = __importDefault(require("./commands/info"));
var utils_1 = require("./utils/utils");
require("dotenv/config");
var client = new discord_js_1.default.Client();
client.on('ready', function () {
    // console.log(`Logged in !`);
});
client.on('message', function (msg) { return __awaiter(void 0, void 0, void 0, function () {
    var msgText, params, slicedParams, x, chosenCmd, cmdErrorEmbed, title, desc, titlere, descre, titleRes_1, descRes, flds, numofunansweredQuestions, answeredRight, nrole, userWhoPassed;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                // all maidchan commands go here
                if (msg.author.bot !== true && msg.content.startsWith('!maidchan')) {
                    msgText = msg.content;
                    params = utils_1.splitCommand(msgText);
                    slicedParams = params.slice(2);
                    x = {
                        'recommend-anime': new recommend_1.default(slicedParams),
                        'info-anime': new info_1.default(slicedParams),
                        help: new help_1.default(slicedParams),
                    };
                    chosenCmd = x[params[1]];
                    if (!utils_1.checkValidCommand(msgText, '!', chosenCmd)) {
                        cmdErrorEmbed = new discord_js_1.default.MessageEmbed()
                            .setColor('#ed1f1f')
                            .setTitle('Invalid command')
                            .setDescription('Try `!maidchan help` for instructions on how to use this bot');
                        msg.channel.send(cmdErrorEmbed);
                        return [2 /*return*/];
                    }
                    chosenCmd.run(msg);
                }
                if (!(msg.author.username === 'Kotoba' &&
                    msg.author.discriminator === '3829' &&
                    msg.author.bot)) return [3 /*break*/, 3];
                if (!msg.embeds.length) return [3 /*break*/, 3];
                title = msg.embeds[0].title;
                desc = msg.embeds[0].description;
                titlere = /JLPT (N[1-5]) Reading Quiz Ended/;
                descre = /The score limit of 10 was reached by <@(\d*)>. Congratulations!/;
                if (!(title && desc)) return [3 /*break*/, 3];
                titleRes_1 = title.match(titlere);
                descRes = desc.match(descre);
                if (!(titleRes_1 && descRes)) return [3 /*break*/, 3];
                flds = msg.embeds[0].fields[1];
                numofunansweredQuestions = void 0;
                if (typeof flds === undefined) {
                    numofunansweredQuestions = 0;
                }
                else {
                    numofunansweredQuestions = flds.value.split('\n').length;
                }
                answeredRight = 10 - numofunansweredQuestions;
                if (!(titleRes_1[1] && descRes[1] && answeredRight >= 7)) return [3 /*break*/, 3];
                return [4 /*yield*/, ((_a = msg.guild) === null || _a === void 0 ? void 0 : _a.roles.cache.find(function (rl) { return rl.name === titleRes_1[1]; }))];
            case 1:
                nrole = _c.sent();
                if (!nrole) return [3 /*break*/, 3];
                userWhoPassed = (_b = msg.guild) === null || _b === void 0 ? void 0 : _b.members.cache.get(descRes[1]);
                return [4 /*yield*/, (userWhoPassed === null || userWhoPassed === void 0 ? void 0 : userWhoPassed.roles.add(nrole))];
            case 2:
                _c.sent();
                _c.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); });
client.on('guildMemberAdd', function (member) {
    var txtChannel = member.guild.channels.cache.get('733746552119754853');
    if (member.user) {
        var welcomeEmbed = new discord_js_1.default.MessageEmbed()
            .setTitle("Welcome to The Japan Zone " + member.user.username + "#" + member.user.discriminator + "!")
            .setDescription('To join the server, type `k!quiz n5` and get a 7/10 (or better) on the N5 quiz. Good luck!')
            .setColor('#e0b04a');
        txtChannel.send({ embed: welcomeEmbed });
    }
});
client.login(process.env.TOKEN);
//# sourceMappingURL=app.js.map
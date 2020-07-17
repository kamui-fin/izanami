"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var discord_js_1 = __importDefault(require("discord.js"));
var recommend_1 = __importDefault(require("./commands/recommend"));
var help_1 = __importDefault(require("./commands/help"));
var utils_1 = require("./utils/utils");
require('dotenv').config();
var client = new discord_js_1.default.Client();
client.on('ready', function () {
    console.log("Logged in !");
});
client.on('message', function (msg) {
    if (msg.author.bot !== true && msg.content.startsWith('!anilist')) {
        var msgText = msg.content;
        var params = utils_1.splitCommand(msgText);
        var slicedParams = params.slice(2);
        var x = {
            recommend: new recommend_1.default(slicedParams),
            help: new help_1.default(slicedParams),
        };
        var chosenCmd = x[params[1]];
        if (!utils_1.checkValidCommand(msgText, '!', chosenCmd)) {
            var cmdErrorEmbed = new discord_js_1.default.MessageEmbed()
                .setColor('#ed1f1f')
                .setTitle('Invalid command')
                .setDescription('Try `!anilist help` for instructions on how to use this bot');
            msg.channel.send(cmdErrorEmbed);
            return;
        }
        chosenCmd.run(msg);
    }
});
client.login(process.env.TOKEN);
//# sourceMappingURL=app.js.map
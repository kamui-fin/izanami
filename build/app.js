"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var discord_js_1 = __importDefault(require("discord.js"));
var recommend_1 = __importDefault(require("./commands/recommend"));
var utils_1 = require("./utils/utils");
require('dotenv').config();
var client = new discord_js_1.default.Client();
client.on('ready', function () {
    console.log("Logged in !");
});
client.on('message', function (msg) {
    if (msg.author.bot !== true) {
        var msgText = msg.content;
        var params = utils_1.splitCommand(msgText);
        console.log(params);
        var x = {
            recommend: new recommend_1.default(params.slice(2)),
        };
        var chosenCmd = x[params[1]];
        if (!utils_1.checkValidCommand(msgText, '!', chosenCmd)) {
            msg.channel.send('Invalid command');
            return;
        }
        chosenCmd.run(msg);
    }
});
client.login(process.env.TOKEN);
//# sourceMappingURL=app.js.map
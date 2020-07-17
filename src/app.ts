import Discord from 'discord.js';
import AniRecommender from './commands/recommend';
import { checkValidCommand, splitCommand } from './utils/utils';
import { Command } from './types/command';

require('dotenv').config();

const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in !`);
});

client.on('message', (msg: Discord.Message) => {
  if (msg.author.bot !== true) {
    const msgText = msg.content;
    const params = splitCommand(msgText);
    console.log(params);

    const x: { [key: string]: Command } = {
      recommend: new AniRecommender(params.slice(2)),
    };
    const chosenCmd = x[params[1]];
    if (!checkValidCommand(msgText, '!', chosenCmd)) {
      msg.channel.send('Invalid command');
      return;
    }
    chosenCmd.run(msg);
  }
});

client.login(process.env.TOKEN);

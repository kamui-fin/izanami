import Discord from 'discord.js';
import AniRecommender from './commands/recommend';
import AniHelp from './commands/help';
import { checkValidCommand, splitCommand } from './utils/utils';
import { Command } from './types/command';

require('dotenv').config();

const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in !`);
});

client.on('message', (msg: Discord.Message) => {
  if (msg.author.bot !== true && msg.content.startsWith('!anilist')) {
    const msgText = msg.content;
    const params = splitCommand(msgText);
    const slicedParams = params.slice(2);
    const x: { [key: string]: Command } = {
      recommend: new AniRecommender(slicedParams),
      help: new AniHelp(slicedParams),
    };
    const chosenCmd = x[params[1]];
    if (!checkValidCommand(msgText, '!', chosenCmd)) {
      let cmdErrorEmbed = new Discord.MessageEmbed()
        .setColor('#ed1f1f')
        .setTitle('Invalid command')
        .setDescription(
          'Try `!anilist help` for instructions on how to use this bot'
        );
      msg.channel.send(cmdErrorEmbed);
      return;
    }
    chosenCmd.run(msg);
  }
});

client.login(process.env.TOKEN);

import { Command } from '../types/command';
import { Message } from 'discord.js';
import Discord from 'discord.js';

class AniHelp implements Command {
  name: string = 'help';
  description: string = 'Shows usage info on all anilist commands';
  params: string[];

  constructor(prms: string[]) {
    this.params = prms;
  }

  correctParams(): boolean {
    return true;
  }
  run(msg: Message) {
    let helpEmbed = new Discord.MessageEmbed()
      .setColor('#3598e8')
      .setTitle('Anilist bot usage instructions')
      .addFields(
        {
          name: '`recommend [anime] [limit]`',
          value: 'Recommends an anime from a title you liked, with a limit',
        },
        {
          name: '`help`',
          value: 'Shows this help message',
        }
      );
    msg.channel.send(helpEmbed);
  }
}

export default AniHelp;

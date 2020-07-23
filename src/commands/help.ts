import Discord, { Message } from 'discord.js';

import { Command } from '../types/command.d';

class AniHelp implements Command {
  name = 'help';

  description = 'Shows usage info on all anilist commands';

  stringParams: string[];

  helpEmbed: Discord.MessageEmbed = new Discord.MessageEmbed()
    .setColor('#3598e8')
    .setTitle('MaidChan usage instructions')
    .addFields(
      {
        name: '`info-anime {title}`',
        value:
          'Shows information about an anime. Be sure to wrap the title around quotes',
      },
      {
        name: '`info-ln {title}`',
        value: `Displays information for a light novel`,
      },
      {
        name: '`info-manga {title}`',
        value: `Displays information for manga`,
      },
      {
        name: '`info-vn {title}`',
        value: `Displays information for a visual novel`,
      },
      {
        name: '`recommend-anime {title} [limit] [star_#]`',
        value:
          'Recommends an anime from a title you liked, with an optional limit and star filter. Be sure to wrap the title around quotes',
      },
      {
        name: '`recommend-manga {title} [limit]`',
        value: `Recommends manga from a title you enjoy`,
      },
      {
        name: '`recommend-vn {title} [limit]`',
        value: `Recommends visual novels from a title you enjoy`,
      },
      {
        name: '`event {title} {episodes_streamed} {stream_date} {time}`',
        value:
          'Creates event embed for show being hosted. Provide range of episodes, use mm/dd/yyyy for date, and UTC time for time',
      },
      {
        name: '`help`',
        value: 'Shows this help message',
      }
    )
    .setFooter('{} means mandatory \t[] means optional');

  constructor(prms: string[]) {
    this.stringParams = prms;
  }

  correctParams(): boolean {
    return this.stringParams.length >= 0;
  }

  run(msg: Message): void {
    msg.channel.send(this.helpEmbed);
  }
}

export default AniHelp;

import { Client, Message, Channel, TextChannel } from 'discord.js';
import { Command } from '../types/command.d';
import {
  fixDesc,
  eventStarter,
  getEventEmbed,
  notValidEmbed,
} from '../utils/utils';
import AniList from '../utils/anilist';

class AniEvent implements Command {
  name = 'event';

  aliases?: string[] | undefined;

  description = 'Creates event for server';

  stringParams: string[];

  client: Client;

  constructor(prms: string[], client: Client) {
    this.stringParams = prms;
    this.client = client;
  }

  correctParams(): boolean {
    const fromAnime = this.stringParams[0];
    return typeof fromAnime !== undefined;
  }

  async run(msg: Message): Promise<void> {
    const ourServer = this.client.guilds.cache.get('732631790191378453');
    const eventChannel: Channel | undefined = ourServer?.channels.cache.get(
      '732633915667251302'
    );
    if (msg.member?.roles.cache.has('732649305625722900')) {
      const anilist: AniList = new AniList(this.stringParams[0]);
      const episodesToStream = this.stringParams[1];
      const mmddyyyy = this.stringParams[2];
      const time = this.stringParams[3];
      const date = new Date(`${`${mmddyyyy} ${time}`}`);
      const res = await anilist.getInfoOfAnime();
      res.description = fixDesc(res.description, 300);
      const embed = getEventEmbed(
        res,
        episodesToStream,
        mmddyyyy,
        time,
        msg.author.id
      );
      if (eventChannel instanceof TextChannel) {
        eventChannel.send('<@&732668352022970458>');
        eventChannel.send({ embed });
      }
      embed.title = 'Event Started';
      eventStarter(embed, date, eventChannel);
    } else {
      notValidEmbed(msg);
    }
  }
}

export default AniEvent;

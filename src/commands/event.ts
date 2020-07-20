import { Client, Message } from 'discord.js';
import { Command } from '../types/command.d';
import { getEmbed, fixDesc, eventStarter } from '../utils/utils';
import AniList from '../utils/anilist';

class AniEvent implements Command {
  name = 'event';

  aliases?: string[] | undefined;

  description = 'Creates event for server';

  stringParams: string[];

  constructor(prms: string[]) {
    this.stringParams = prms;
  }

  correctParams(): boolean {
    const fromAnime = this.stringParams[0];
    return typeof fromAnime !== undefined;
  }

  async run(msg: Message) {
    const client = new Client();
    const anilist: AniList = new AniList(this.stringParams[0]);
    const episodesToStream = this.stringParams[1];
    const mmddyyyy = this.stringParams[2];
    const time = this.stringParams[3];
    const date = new Date(`${`${mmddyyyy} ${time}`}`);
    const res = await anilist.getInfoOfAnime();
    res.description = fixDesc(res.description, 300);
    const embed = getEmbed(res, true, episodesToStream, mmddyyyy, time);
    msg.channel.send({ embed });

    embed.title = 'Event Started';
    eventStarter(client, embed, date);
  }
}

export default AniEvent;

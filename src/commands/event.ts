import { Message } from 'discord.js';
import { Command } from '../types/command.d';
import { getEmbed, fixDesc } from '../utils/utils';
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
    const episodesToStream = this.stringParams[1];
    const timeOfEvent = this.stringParams[2];
    return typeof fromAnime !== undefined;
  }

  async run(msg: Message) {
    const anilist: AniList = new AniList(this.stringParams[0]);
    const res = await anilist.getInfoOfAnime();
    res.description = fixDesc(res.description, 300);
    const embed = getEmbed(res, true, this.stringParams[1], this.stringParams[2]);

    msg.channel.send({ embed });
  }
}

export default AniEvent;

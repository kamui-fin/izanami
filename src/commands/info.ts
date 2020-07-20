import { Message } from 'discord.js';
import { Command } from '../types/command.d';
import { getEmbed, fixDesc, notFoundEmbed } from '../utils/utils';
import AniList from '../utils/anilist';

class AniInfo implements Command {
  name = 'info-anime';

  aliases?: string[] | undefined;

  description = 'Shows information about an anime';

  stringParams: string[];

  constructor(prms: string[]) {
    this.stringParams = prms;
  }

  correctParams(): boolean {
    const fromAnime = this.stringParams[0];
    return typeof fromAnime !== undefined;
  }

  async run(msg: Message): Promise<void> {
    const anilist: AniList = new AniList(this.stringParams[0]);
    try {
      const res = await anilist.getInfoOfAnime();
      res.description = fixDesc(res.description, 300);
      const embed = getEmbed(res);

      msg.channel.send({ embed });
    } catch (error) {
      notFoundEmbed(msg, 'Anime');
    }
  }
}

export default AniInfo;

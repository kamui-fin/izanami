import { Message, MessageEmbed } from 'discord.js';
import { Command } from '../types/command';
import { MediaRecommendation, Node, TopLevel } from '../types/anime';
import { getEmbed, fixDesc, shuffleArray } from '../utils/utils';
import AniList from '../utils/anilist';

class AniRecommender implements Command {
  name = 'recommend';

  aliases?: string[] | undefined;

  description = 'Recommends anime from anilist based on a title';

  params: string[];

  constructor(prms: string[]) {
    this.params = prms;
  }

  correctParams(): boolean {
    const fromAnime = this.params[0];
    const limitRecs = this.params[1];

    if (
      fromAnime &&
      limitRecs &&
      parseInt(limitRecs) !== NaN &&
      parseInt(limitRecs) <= 5 &&
      parseInt(limitRecs) > 0
    ) {
      return true;
    }
    return false;
  }

  async run(msg: Message) {
    const anilist: AniList = new AniList(this.params[0]);
    const reccs: any = await anilist.getReccomendations(
      parseInt(this.params[1])
    );

    shuffleArray(reccs);
    for (let recc of reccs) {
      const onerec: TopLevel = recc;
      const onemediarecc: MediaRecommendation = onerec.node.mediaRecommendation;
      onemediarecc.description = fixDesc(onemediarecc.description, 300);
      const embed = getEmbed(onemediarecc);
      msg.channel.send({ embed });
    }
  }
}

export default AniRecommender;

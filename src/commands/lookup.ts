import { Message } from 'discord.js';
import { Command } from '../types/command.d';
import { notFoundEmbed, getLookupEmbed } from '../utils/utils';
import Goo from '../utils/goo';

class Lookup implements Command {
  name = 'lookup';

  aliases?: string[] | undefined;

  description = 'Looks up a word in goo';

  stringParams: string[];

  constructor(prms: string[]) {
    this.stringParams = prms;
  }

  correctParams(): boolean {
    const word = this.stringParams[0];
    return typeof word !== undefined;
  }

  async run(msg: Message): Promise<void> {
    try {
      const res = await Goo.searchWord(this.stringParams[0].slice(1, -1));
      const embed = getLookupEmbed(res);
      msg.channel.send({ embed });
    } catch (error) {
      notFoundEmbed(msg, 'Word');
    }
  }
}

export default Lookup;

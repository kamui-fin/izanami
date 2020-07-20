// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { HowLongToBeatService, HowLongToBeatEntry } from 'howlongtobeat';
import { MessageEmbed, Message } from 'discord.js';
import { Command } from '../types/command.d';
import { notFoundEmbed } from '../utils/utils';

class GameDuration implements Command {
  name = 'duration-game';

  aliases?: string[] | undefined;

  description = 'displays the number of hours required to beat a game';

  stringParams: string[];

  hltbService: HowLongToBeatService;

  constructor(prms: string[]) {
    this.stringParams = prms;
    this.hltbService = new HowLongToBeatService();
  }

  correctParams(): boolean {
    const gameName = this.stringParams[0];
    return typeof gameName !== undefined;
  }

  async findGameDurationInfo(): Promise<HowLongToBeatEntry> {
    const data: Array<HowLongToBeatEntry> = await this.hltbService.search(
      this.stringParams[0].slice(1, -1)
    );
    return data[0];
  }

  async run(msg: Message): Promise<void> {
    const data: HowLongToBeatEntry = await this.findGameDurationInfo();
    if (data) {
      const dataEmbed = new MessageEmbed()
        .setTitle(data.name)
        .setURL(`https://howlongtobeat.com/game.php?id=${data.id}`)
        .setColor('#78b1eb')
        .setImage(data.imageUrl);
      data.timeLabels.forEach((element: Array<string>) => {
        let hours: number | string = data[element[0]];
        if (hours === 0) hours = '--';
        dataEmbed.addField(element[1], `${hours} hours`);
      });
      msg.channel.send({ embed: dataEmbed });
    } else {
      notFoundEmbed(msg, 'Game');
    }
  }
}

export default GameDuration;

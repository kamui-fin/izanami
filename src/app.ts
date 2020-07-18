/* eslint-disable radix */
import Discord from 'discord.js';
import AniRecommender from './commands/recommend';
import AniHelp from './commands/help';
import AniInfo from './commands/info';
import KotobaListener from './kotoba/kotobaListener';
import { checkValidCommand, splitCommand, decideRoles } from './utils/utils';
import { Command } from './types/command.d';
import welcome from './utils/welcome';
import 'dotenv/config';

const client = new Discord.Client();

client.on('ready', () => {
  // console.log(`Logged in !`);
});

client.on('message', async (msg: Discord.Message) => {
  // all maidchan commands go here
  if (msg.author.bot !== true && msg.content.startsWith('!maidchan')) {
    const msgText = msg.content;
    const params = splitCommand(msgText);
    const slicedParams = params.slice(2);
    const x: { [key: string]: Command } = {
      'recommend-anime': new AniRecommender(slicedParams),
      'info-anime': new AniInfo(slicedParams),
      help: new AniHelp(slicedParams),
    };

    const chosenCmd = x[params[1]];
    if (!checkValidCommand(msgText, '!', chosenCmd)) {
      const cmdErrorEmbed = new Discord.MessageEmbed()
        .setColor('#ed1f1f')
        .setTitle('Invalid command')
        .setDescription(
          'Try `!maidchan help` for instructions on how to use this bot'
        );
      msg.channel.send(cmdErrorEmbed);
      return;
    }
    chosenCmd.run(msg);
  }

  // all jlpt related stuff goes here
  if (
    msg.author.username === 'Kotoba' &&
    msg.author.discriminator === '3829' &&
    msg.author.bot
  ) {
    const kotoListener = new KotobaListener(msg);
    if (kotoListener.hasGameEnded()) {
      console.log('Game has ended');

      const finishInfo = kotoListener.getFinishInfo();
      console.log(finishInfo);

      if (finishInfo.answeredRight >= finishInfo.player.needToGetRight) {
        const jlptRoleTheyHad = KotobaListener.getJlptRoleTheyHad(
          finishInfo.player
        );
        console.log(jlptRoleTheyHad);

        const quizRole = kotoListener.getQuizRole();
        console.log(quizRole);

        decideRoles(finishInfo, quizRole, jlptRoleTheyHad, kotoListener);
      }
    }
  }
});

client.on('guildMemberAdd', welcome);

client.login(process.env.BOT_TOKEN);

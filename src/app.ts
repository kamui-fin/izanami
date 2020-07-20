/* eslint-disable radix */
import Discord from 'discord.js';
import AniRecommender from './commands/recommend';
import AniHelp from './commands/help';
import AniInfo from './commands/info';
import AniEvent from './commands/event';
import KotobaListener from './kotoba/kotobaListener';
import {
  checkValidCommand,
  splitCommand,
  decideRoles,
  boostReminder,
} from './utils/utils';
import { Command } from './types/command.d';
import welcome from './utils/welcome';
import 'dotenv/config';
import GameDuration from './commands/durationGame';

const client = new Discord.Client();

client.on('ready', () => {
  // // console.log(`Logged in !`);
});

client.on('message', async (msg: Discord.Message) => {
  // all maidchan commands go here
  if (msg.author.bot !== true && msg.content.startsWith('!maidchan')) {
    const msgText = msg.content;
    const params = splitCommand(msgText);
    if (params) {
      const slicedParams = params.slice(2);

      const x: { [key: string]: Command } = {
        'recommend-anime': new AniRecommender(slicedParams),
        'info-anime': new AniInfo(slicedParams),
        event: new AniEvent(slicedParams, client),
        'duration-game': new GameDuration(slicedParams),
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
  }

  // all jlpt related stuff goes here
  if (
    msg.author.username === 'Kotoba' &&
    msg.author.discriminator === '3829' &&
    msg.author.bot
  ) {
    const kotoListener = new KotobaListener(msg);
    if (kotoListener.hasGameEnded()) {
      // console.log('Game has ended');

      const finishInfo = kotoListener.getFinishInfo();
      // console.log(finishInfo);

      if (finishInfo.answeredRight >= finishInfo.player.needToGetRight) {
        const jlptRoleTheyHad = KotobaListener.getJlptRoleTheyHad(
          finishInfo.player
        );
        // console.log(jlptRoleTheyHad);

        const quizRole = kotoListener.getQuizRole();
        // console.log(quizRole);
        const japaneseRole = msg.guild?.roles.cache.get('732644505248989215');
        decideRoles(
          finishInfo,
          quizRole,
          jlptRoleTheyHad,
          kotoListener,
          japaneseRole
        );
      }
    }
  }

  if (msg.author.id === '302050872383242240' && msg.embeds) {
    const embed = msg.embeds[0];
    if (embed.description?.includes('Bump done')) {
      boostReminder(client);
    }
  }
});

client.on('guildMemberAdd', (member) => {
  welcome(
    member,
    '733500570421297253',
    `Welcome to The Japan Zone, ${member.user?.username}!`,
    `To join the server, type \`k!quiz n5\` and get a 7/10 (or better) on the N5 quiz. Good luck!`
  );
});

client.login(process.env.BOT_TOKEN);

import Discord from 'discord.js';
import AniRecommender from './commands/recommend';
import AniHelp from './commands/help';
import AniInfo from './commands/info';
import { checkValidCommand, splitCommand } from './utils/utils';
import { Command } from './types/command.d';
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
    if (msg.embeds.length) {
      const { title } = msg.embeds[0];
      const desc = msg.embeds[0].description;
      const titlere = /JLPT (N[1-5]) Reading Quiz Ended/;
      const descre = /The score limit of 10 was reached by <@(\d*)>. Congratulations!/;
      if (title && desc) {
        const titleRes = title.match(titlere);
        const descRes = desc.match(descre);
        if (titleRes && descRes) {
          const flds = msg.embeds[0].fields[1];
          let numofunansweredQuestions;
          if (typeof flds === undefined) {
            numofunansweredQuestions = 0;
          } else {
            numofunansweredQuestions = flds.value.split('\n').length;
          }
          const answeredRight = 10 - numofunansweredQuestions;
          if (titleRes[1] && descRes[1] && answeredRight >= 7) {
            // give roles here
            const nrole = await msg.guild?.roles.cache.find(
              (rl) => rl.name === titleRes[1]
            );
            if (nrole) {
              const userWhoPassed = msg.guild?.members.cache.get(descRes[1]);
              await userWhoPassed?.roles.add(nrole);
            }
          }
        }
      }
    }
  }
});

client.on('guildMemberAdd', (member) => {
  const txtChannel: any = member.guild.channels.cache.get('733746552119754853');
  if (member.user) {
    const welcomeEmbed = new Discord.MessageEmbed()
      .setTitle(
        `Welcome to The Japan Zone ${member.user.username}#${member.user.discriminator}!`
      )
      .setDescription(
        'To join the server, type `k!quiz n5` and get a 7/10 (or better) on the N5 quiz. Good luck!'
      )
      .setColor('#e0b04a');
    txtChannel.send({ embed: welcomeEmbed });
  }
});

client.login(process.env.TOKEN);

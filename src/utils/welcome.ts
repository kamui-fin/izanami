import { MessageEmbed } from 'discord.js';

const welcome = (member): void => {
  const txtChannel: any = member.guild.channels.cache.get('733500570421297253');
  if (member.user) {
    const welcomeEmbed = new MessageEmbed()
      .setTitle(
        `Welcome to The Japan Zone ${member.user.username}#${member.user.discriminator}!`
      )
      .setDescription(
        'To join the server, type `k!quiz n5` and get a 7/10 (or better) on the N5 quiz. Good luck!'
      )
      .setColor('#e0b04a');
    txtChannel.send({ embed: welcomeEmbed });
  }
};
export default welcome;

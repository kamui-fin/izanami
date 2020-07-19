import { MessageEmbed } from 'discord.js';

const welcome = (member, channel: string, description: string): void => {
  const txtChannel: any = member.guild.channels.cache.get(channel);
  if (member.user) {
    const welcomeEmbed = new MessageEmbed()
      .setTitle(`Welcome to The Japan Zone, ${member.user.username}!`)
      .setDescription(description)
      .setColor('#e0b04a');
    txtChannel.send({ embed: welcomeEmbed });
  }
};
export default welcome;

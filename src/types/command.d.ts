import { Message, MessageEmbed } from 'discord.js';

export interface Command {
  name: string;
  aliases?: string[];
  description: string;
  params: string[];
  correctParams(): boolean;
  run(msg: Message): any;
}

import { Message } from 'discord.js';

export interface Command {
  name: string;
  aliases?: string[];
  description: string;
  stringParams: string[];
  correctParams(): boolean;
  run(msg: Message): any;
}

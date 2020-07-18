import { GuildMember, Role } from 'discord.js';

export interface UserInfo {
  user: GuildMember;
  roles: Array<Role>;
  justJoined: boolean;
  needToGetRight: number;
}

export interface FinishInfo {
  quizlevel: number;
  player: UserInfo;
  answeredRight: number;
}

export interface FinishEmbedMatch {
  titleMatch: RegExpMatchArray;
  descMatch: RegExpMatchArray;
}

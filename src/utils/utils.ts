/* eslint-disable radix */
import {
  Role,
  Channel,
  Client,
  MessageEmbed,
  TextChannel,
  Message,
} from 'discord.js';
import axios, { AxiosResponse } from 'axios';
import { MediaRecommendation } from '../types/anime.d';
import { Command } from '../types/command.d';
import { FinishInfo } from '../types/kotoba.d';
import KotobaListener from '../kotoba/kotobaListener';
import welcome from './welcome';

export const sendGraphQL = async (
  baseUrl: string,
  query: string,
  variables: Record<string, unknown>
): Promise<AxiosResponse> => {
  const res: AxiosResponse<unknown> = await axios({
    url: baseUrl,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },

    data: {
      query,
      variables,
    },
  });
  return res;
};

const fixAvgScore = (score: number): string => {
  const divided = (score / 10).toLocaleString();
  return `${divided} ⭐`;
};

export const getEmbed = (
  media: MediaRecommendation
): Record<string, unknown> => {
  const embed = {
    title: media.title.native,
    description: media.description,
    url: media.siteUrl,
    color: media.coverImage.color,
    footer: {
      text: `Started ${media.startDate.month}/${media.startDate.day}/${media.startDate.year}`,
    },
    image: {
      url: media.coverImage.large,
    },
    fields: [
      {
        name: 'Genres',
        value: media.genres.join(', '),
      },
      {
        name: 'Episodes',
        value: media.episodes ? media.episodes.toLocaleString() : 'Unknown',
      },
      {
        name: 'Favorites',
        value: media.favourites.toLocaleString(),
        inline: true,
      },
      {
        name: 'Average Score',
        value: fixAvgScore(media.averageScore),
        inline: true,
      },
      {
        name: 'Popularity',
        value: media.popularity.toLocaleString(),
        inline: true,
      },
    ],
  };
  return embed;
};

export const getEventEmbed = (
  media: MediaRecommendation,
  eventEpisodes: string,
  date: string,
  timeOfEvent: string,
  userID: string
): Record<string, unknown> => {
  const embed = {
    title: `Event Scheduled`,
    color: media.coverImage.color,
    image: {
      url: media.coverImage.large,
    },
    fields: [
      {
        name: 'Show',
        value: media.title.native,
      },
      {
        name: 'Event Time',
        value: `${`${date} ${timeOfEvent}`} UTC`,
      },
      {
        name: 'Episodes',
        value: eventEpisodes.slice(1, -1),
        inline: true,
      },
      {
        name: 'Host',
        value: `<@${userID}>`,
        inline: true,
      },
    ],
  };
  return embed;
};

export const fixDesc = (text: string, limitChars: number): string => {
  let desc = text.replace(/<br>/g, '');
  if (desc.length > limitChars) {
    desc = `${desc.slice(0, limitChars)}...`;
  }
  return desc;
};

export const splitCommand = (text: string): string[] | null => {
  let splitted: RegExpMatchArray | null = text.match(/(?:[^\s"]+|"[^"]*")+/g);
  if (splitted) {
    splitted = splitted.filter((el: string) => el.trim() !== '');
  }
  return splitted;
};

export const checkValidCommand = (
  cmd: string,
  prefix: string,
  commandType: Command
): boolean => {
  if (!commandType) {
    return false;
  }
  const splittedCommand = splitCommand(cmd);
  if (splittedCommand) {
    const isCorrectCmdType = splittedCommand[1] === commandType.name;
    const validParams = commandType.correctParams();
    return validParams && isCorrectCmdType;
  }
  return false;
};

export const decideRoles = (
  finishInfo: FinishInfo,
  quizRole: Role | undefined,
  jlptRoleTheyHad: Role | undefined,
  kotoListener: KotobaListener,
  japaneseRole: Role | undefined
): void => {
  const { user } = finishInfo.player;
  if (user) {
    if (jlptRoleTheyHad) {
      if (
        quizRole &&
        Number.parseInt(quizRole.name.charAt(1)) <
          Number.parseInt(jlptRoleTheyHad.name.charAt(1))
      ) {
        // remove old and give them the new role
        user.roles.remove(jlptRoleTheyHad);
        user.roles.add(quizRole);
      }
    } else {
      if (quizRole) user.roles.add(quizRole);
      if (finishInfo.player.justJoined) {
        const unverifiedRole:
          | Role
          | undefined = kotoListener.getUnverifiedRole();
        if (unverifiedRole && japaneseRole) {
          user.roles.remove(unverifiedRole);
          user.roles.add(japaneseRole);
        }
        welcome(
          user,
          '732631790841495685',
          'Welcome to The Japan Zone!',
          `We're glad to have you, <@${user.user.id}>! Make sure to read <#732633420236062870> and assign your role in <#732641885843357717>`
        );
      }
    }
  }
};

export const boostReminder = (client: Client): void => {
  const ourServer = client.guilds.cache.get('732631790191378453');

  const general: Channel | undefined = ourServer?.channels.cache.get(
    '732631790841495685'
  );

  if (general instanceof TextChannel) {
    setTimeout(() => {
      const remindEmbed: MessageEmbed = new MessageEmbed()
        .setTitle('Time to boost!')
        .setDescription(`Type \`!d bump\` to keep our server up in rankings`)
        .setColor('#42f572');

      general.send({ embed: remindEmbed });
    }, 7200000);
  }
};

export const eventStarter = (
  embed: Record<string, unknown>,
  date: Date,
  channel: Channel | undefined
): void => {
  const etaMS = date.getTime() - Date.now();

  if (channel instanceof TextChannel) {
    setTimeout(() => {
      channel.send('<@&732668352022970458>');
      channel.send({ embed });
    }, etaMS);
  }
};

export const notFoundEmbed = (msg: Message, typeMedia: string): void => {
  const nfEmbed = new MessageEmbed()
    .setTitle(`${typeMedia} not found`)
    .setDescription('Please refine your search and try again')
    .setColor('#f54c4c');
  msg.channel.send({ embed: nfEmbed });
};

// thanks to https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
export const shuffleArray = <T>(array: Array<T>): Array<T> => {
  const copiedArray = array;
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copiedArray[i], copiedArray[j]] = [array[j], array[i]];
  }
  return copiedArray;
};

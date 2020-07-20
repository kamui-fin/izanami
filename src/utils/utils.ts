/* eslint-disable radix */
import { Role, Channel, Client, MessageEmbed, TextChannel } from 'discord.js';
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
) => {
  const res: AxiosResponse<any> = await axios({
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
  media: MediaRecommendation,
  isEvent: boolean,
  eventEpisodes: string,
  timeOfEvent: string
): Record<string, unknown> => {
  const embed = {
    title: media.title.native,
    url: media.siteUrl,
    color: media.coverImage.color,
    ...(!isEvent ? {
      description: media.description,
      footer: {
        text: `Started ${media.startDate.month}/${media.startDate.day}/${media.startDate.year}`,
      }
    } : null),
    image: {
      url: media.coverImage.large,
    },
    fields: [
      !!timeOfEvent && {
        name: "Event Time",
        value: timeOfEvent 
      },
      {
        name: 'Episodes',
        value:
          eventEpisodes ||
          (media.episodes ? media.episodes.toLocaleString() : 'Unknown'),
      },
    ],
  };
  if(!isEvent) {
    const infoFields = [
      {
        name: 'Genres',
        value: media.genres.join(', '),
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
    ];
    embed.fields.concat(infoFields);
  }
  return embed;
};

export const fixDesc = (text: string, limitChars: number): string => {
  let desc = text.replace(/<br>/g, '');
  if (desc.length > limitChars) {
    desc = `${desc.slice(0, limitChars)}...`;
  }
  return desc;
};

export const splitCommand = (text: string): string[] => {
  let splitted: any = text.match(/(?:[^\s"]+|"[^"]*")+/g);
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
  const isCorrectCmdType = splittedCommand[1] === commandType.name;
  const validParams = commandType.correctParams();
  console.log(splittedCommand, isCorrectCmdType, validParams);

  return validParams && isCorrectCmdType;
};

export const decideRoles = (
  finishInfo: FinishInfo,
  quizRole: Role | undefined,
  jlptRoleTheyHad: Role | undefined,
  kotoListener: KotobaListener,
  japaneseRole: Role | undefined
): void => {
  const { user } = finishInfo.player;
  if (jlptRoleTheyHad) {
    if (
      Number.parseInt(quizRole.name.charAt(1)) <
      Number.parseInt(jlptRoleTheyHad.name.charAt(1))
    ) {
      // remove old and give them the new role
      user.roles.remove(jlptRoleTheyHad);
      user.roles.add(quizRole);
    }
  } else {
    user.roles.add(quizRole);
    if (finishInfo.player.justJoined) {
      user.roles.remove(kotoListener.getUnverifiedRole());
      user.roles.add(japaneseRole);
      welcome(
        user,
        '732631790841495685',
        "We're glad to have you! Make sure to read <#732633420236062870> and assign your role in <#732641885843357717>"
      );
    }
  }
};

export const boostReminder = (client: Client): void => {
  const ourServer = client.guilds.cache.get('732631790191378453');

  const general: Channel = ourServer.channels.cache.get('732631790841495685');

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

// thanks to https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
export const shuffleArray = (array: Array<any>) => {
  const copiedArray = array;
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copiedArray[i], copiedArray[j]] = [array[j], array[i]];
  }
};

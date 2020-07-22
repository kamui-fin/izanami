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
import Keyv from 'keyv';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { HowLongToBeatEntry } from 'howlongtobeat';
import {
  AnilistRecommendation,
  AnilistRecommendationAnime,
  AnilistRecommendationManga,
} from '../types/anilist.d';
import { Command } from '../types/command.d';
import { FinishInfo } from '../types/kotoba.d';
import KotobaListener from '../kotoba/kotobaListener';
import welcome from './welcome';
import { VNDetail } from '../types/vn.d';

const keyv = new Keyv();

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

interface EmbedField {
  name: string;
  value: string;
}
export const fixDesc = (text: string, limitChars: number): string => {
  let desc = text.replace(/<br>/g, '');
  if (desc.length > limitChars) {
    desc = `${desc.slice(0, limitChars)}...`;
  }
  return desc;
};
const getDurationAnilist = (media: AnilistRecommendation): EmbedField => {
  if ((media as AnilistRecommendationAnime).episodes === undefined) {
    return {
      name: 'Volumes',
      value: (media as AnilistRecommendationManga).volumes
        ? (media as AnilistRecommendationManga).volumes
        : 'Unknown',
    };
  }
  return {
    name: 'Episodes',
    value: (media as AnilistRecommendationManga).volumes
      ? (media as AnilistRecommendationAnime).episodes
      : 'Unknown',
  };
};

export const getAnilistEmbed = (
  media: AnilistRecommendation
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
        value: media.genres ? media.genres.join(', ') : 'Unknown',
      },
      getDurationAnilist(media),
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
  media: AnilistRecommendationAnime,
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

export const getVNEmbed = (
  details: VNDetail,
  playTime: HowLongToBeatEntry
): MessageEmbed => {
  const msgEmbed = new MessageEmbed()
    .setTitle(details.title)
    .setURL(details.link)
    .setDescription(fixDesc(details.desc, 300))
    .setImage(details.image)
    .setColor('#fabd39')
    .setFooter(details.year);

  if (playTime) {
    playTime.timeLabels.forEach((x: Array<string>) => {
      msgEmbed.addField(x[1], playTime[x[0]], true);
    });
  }

  msgEmbed
    .addField('Average Rating', details.avgRating)
    .addField('Total Votes', details.totalVotes);
  return msgEmbed;
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
          welcome(
            user,
            '732631790841495685',
            'Welcome to The Japan Zone!',
            `We're glad to have you, <@${user.user.id}>! Make sure to read <#732633420236062870> and assign your role in <#732641885843357717>`
          );
        }
      }
    }
  }
};

const getGeneral = (client: Client): Channel | undefined => {
  const ourServer = client.guilds.cache.get('732631790191378453');

  const general: Channel | undefined = ourServer?.channels.cache.get(
    '732631790841495685'
  );
  return general;
};

const getMedia = (client: Client): Channel | undefined => {
  const ourServer = client.guilds.cache.get('732631790191378453');

  const media: Channel | undefined = ourServer?.channels.cache.get(
    '732634726883655821'
  );
  return media;
};

export const boostReminder = (client: Client): void => {
  const general: Channel | undefined = getGeneral(client);

  if (general instanceof TextChannel) {
    setTimeout(() => {
      const remindEmbed: MessageEmbed = new MessageEmbed()
        .setTitle('Time to boost!')
        .setDescription(`Type \`!d bump\` to keep our server up in rankings`)
        .setColor('#42f572');

      general.send({ embed: remindEmbed }).then((msg: Message) => {
        keyv.set('boostmsg', msg.id);
      });
    }, 7200000);
  }
};

export const deleteBump = async (client: Client): Promise<void> => {
  const general: Channel | undefined = getGeneral(client);
  const boostKey: string = await keyv.get('boostmsg');
  if (general instanceof TextChannel) {
    general.messages
      .fetch(boostKey)
      .then((msg: Message) => {
        msg.delete();
      })
      .catch(console.error);
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

export const notValidEmbed = (msg: Message): void => {
  const invalidEmbed = new MessageEmbed()
    .setTitle(`Invalid Permissions`)
    .setDescription('You do not have permissions to run this command.')
    .setColor('#8b0000');
  msg.channel.send({ embed: invalidEmbed });
};

interface Source {
  id: string;
  name: string;
}
interface Article {
  source: Source;
  author: string;
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  content: string;
}

// thanks to https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
export const shuffleArray = <T>(array: Array<T>): Array<T> => {
  const copiedArray = array;
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copiedArray[i], copiedArray[j]] = [array[j], array[i]];
  }
  return copiedArray;
};

const getRandomNews = async (): Promise<string> => {
  const url =
    'http://newsapi.org/v2/top-headlines?country=jp&apiKey=460667df4de44a518f57689ca5dbfecd';
  const data = await axios.get(url);
  const articles: Array<Article> = shuffleArray(data.data.articles);
  return articles[0].url;
};

export const setupRandomNewsFeed = (client: Client): void => {
  const mediaChannel = getMedia(client);
  if (mediaChannel instanceof TextChannel) {
    setInterval(async () => {
      const url = await getRandomNews();
      mediaChannel.send(url);
    }, 86400000);
  }
};

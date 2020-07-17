import axios from 'axios';
import { MediaRecommendation } from '../types/anime';
import { Command } from '../types/command';

export const sendGraphQL = async (
  baseUrl: string,
  query: string,
  variables: Object
) => {
  const res: any = await axios({
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

export const getEmbed = (media: MediaRecommendation): Object => {
  const embed = {
    title: media.title.native,
    description: media.description,
    url: media.siteUrl,
    color: media.coverImage.color,
    footer: {
      text: `Started ${media.startDate.month} ${media.startDate.day}, ${media.startDate.year}`,
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
        value: media.episodes.toLocaleString(),
      },
      {
        name: 'Favorites',
        value: media.favourites.toLocaleString(),
        inline: true,
      },
      {
        name: 'Average Score',
        value: media.averageScore.toLocaleString(),
        inline: true,
      },
      {
        name: 'Popularity',
        value: media.popularity.toLocaleString(),
        inline: true,
      },
      {
        name: 'Favorites',
        value: media.favourites.toLocaleString(),
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
  const isAnilistCmd = splittedCommand[0].startsWith(`${prefix}anilist`);
  const isCorrectCmdType = splittedCommand[1] === commandType.name;
  const validParams = commandType.correctParams();
  return validParams && isCorrectCmdType && isAnilistCmd;
};

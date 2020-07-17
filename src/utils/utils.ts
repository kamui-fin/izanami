import axios from 'axios';
import { MediaRecommendation } from '../types/anime.d';
import { Command } from '../types/command.d';

export const sendGraphQL = async (
  baseUrl: string,
  query: string,
  variables: Record<string, unknown>
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
  const isCorrectCmdType = splittedCommand[1] === commandType.name;
  const validParams = commandType.correctParams();
  console.log(splittedCommand, isCorrectCmdType, validParams);

  return validParams && isCorrectCmdType;
};

// thanks to https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
export const shuffleArray = (array: Array<any>) => {
  const copiedArray = array;
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copiedArray[i], copiedArray[j]] = [array[j], array[i]];
  }
};

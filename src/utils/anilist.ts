import { MediaRecommendation, TopLevel } from '../types/anime.d';
import { sendGraphQL } from './utils';

export default class AniList {
  baseURL = 'https://graphql.anilist.co';

  query: string;

  searchQuery = `
  query ($txt: String) {
    Media(search:$txt, type:ANIME){
      id,
      title{
        native
      }
      coverImage {
        color
        extraLarge
        large
        medium
    }
    title {
        native
    }
    siteUrl
    description
    episodes
    genres
    averageScore
    popularity
    favourites
    startDate {
        year
        month
        day
    }
    }
  }
  `;

  reccQuery = `
    query ($id: Int) {
        Media(id: $id, type: ANIME) {
        recommendations {
            edges {
            node {
                media {
                title {
                    native
                }
                }
                mediaRecommendation {
                coverImage {
                    color
                    extraLarge
                    large
                    medium
                }
                title {
                    native
                }
                siteUrl
                description
                episodes
                genres
                averageScore
                popularity
                favourites
                startDate {
                    year
                    month
                    day
                }
                }
            }
            }
        }
        }
    }
  
  
  `;

  constructor(query: string) {
    this.query = query;
  }

  async getReccomendations(limit: number): Promise<TopLevel[]> {
    const res = await this.getInfoOfAnime();

    const { id } = res;
    // const basedOfTitle = res.data.data.Media.title.native;

    const recommendations = await sendGraphQL(this.baseURL, this.reccQuery, {
      id,
    });

    const reccs = <TopLevel[]>(
      recommendations.data.data.Media.recommendations.edges
    );

    return limit > reccs.length ? reccs : reccs.slice(0, limit);
  }

  async getInfoOfAnime(): Promise<MediaRecommendation> {
    const res = await sendGraphQL(this.baseURL, this.searchQuery, {
      txt: this.query.slice(1, this.query.length),
    });
    return res.data.data.Media;
  }
}

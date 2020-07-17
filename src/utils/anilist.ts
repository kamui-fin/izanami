import axios from 'axios';
import { MediaRecommendation, Node, TopLevel } from '../types/anime';
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

  async getReccomendations(limit: number) {
    const res = await sendGraphQL(this.baseURL, this.searchQuery, {
      txt: this.query.slice(1, this.query.length),
    });
    const { id } = res.data.data.Media;
    const basedOfTitle = res.data.data.Media.title.native;

    const recommendations = await sendGraphQL(this.baseURL, this.reccQuery, {
      id,
    });

    const reccs = <MediaRecommendation[]>(
      recommendations.data.data.Media.recommendations.edges
    );

    return limit > reccs.length ? reccs : reccs.slice(0, limit);
  }
}

import { AnilistRecommendation, TopLevel } from "../types";
import { sendGraphQL } from ".";

const BASE_URL = "https://graphql.anilist.co";

const getLengthType = (type: string): string => {
    return type === "MANGA" ? "volumes" : "episodes";
}

const getSearchQuery = (type: string): string => {
    const searchQuery = `
    query ($txt: String) {
        Media(search:$txt, type:${type}){
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
            ${getLengthType(type)}
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
    return searchQuery;
};

const getReccQuery = (type: string): string => {
    const reccQuery = `
    query ($id: Int) {
        Media(id: $id, type: ${type}) {
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
                ${getLengthType(type)}
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
    return reccQuery;
};

export const getInfo = async (
    type: string,
    query: string
): Promise<AnilistRecommendation> => {
    const res = await sendGraphQL(BASE_URL, getSearchQuery(type), {
        txt: query.slice(1, -1),
    });
    return res.data.data.Media;
};

export const getReccomendations = async (
    type: string,
    query: string,
    limit: number
): Promise<TopLevel[]> => {
    const res = await getInfo(type, query);
    const { id } = res;
    const recommendations = await sendGraphQL(BASE_URL, getReccQuery(type), {
        id,
    });

    const reccs = <TopLevel[]>(
        recommendations.data.data.Media.recommendations.edges
    );

    return limit > reccs.length ? reccs : reccs.slice(0, limit);
};

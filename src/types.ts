import { GuildMember, Role, Message, Client, MessageEmbed } from "discord.js";

export interface TopLevel {
    node: Node;
}

export interface Node {
    media: Media;
    mediaRecommendation: AnilistRecommendation;
}

export interface Media {
    title: Title;
}

export interface Title {
    native: string;
}

export interface AnilistRecommendationBase {
    id?: number;
    coverImage: CoverImage;
    title: Title;
    siteUrl: string;
    description: string;
    genres: string[];
    averageScore: number;
    popularity: number;
    favourites: number;
    startDate: StartDate;
    eventTime: string;
}

export interface AnilistRecommendationAnime extends AnilistRecommendationBase {
    episodes: string;
    kind: "anime";
}

export interface AnilistRecommendationManga extends AnilistRecommendationBase {
    volumes: string;
}

export type AnilistRecommendation =
    | AnilistRecommendationAnime
    | AnilistRecommendationManga;

export interface CoverImage {
    color: string;
    extraLarge: string;
    large: string;
    medium: string;
}

export interface StartDate {
    year: number;
    month: number;
    day: number;
}

export interface Command {
    stringParams?: string[];
    correctParams?(): boolean;
    run(msg: Message): void;
}
export interface Show {
    kind: "drama";
    title: string | undefined | null;
    description: string | undefined | null;
    episodes: string | undefined | null;
    rank: string | undefined | null;
    score: string | undefined | null;
    picture: string | undefined | null;
    aired: string | undefined | null;
    genres: string | undefined | null;
}

export interface UserInfo {
    user: GuildMember | undefined;
    roles: Array<Role> | undefined;
    justJoined: boolean;
    needToGetRight: number;
}

export interface FinishInfo {
    quizlevel: number | null;
    player: UserInfo;
    answeredRight: number;
}

export interface FinishEmbedMatch {
    titleMatch: RegExpMatchArray | null;
    descMatch: RegExpMatchArray | null;
}
export interface SearchResult {
    id: string;
    title: string;
    page: string;
    path?: string;
}

export interface LNDetail {
    id: string | null;
    title: string | undefined;
    author: string | undefined;
    link: string;
    desc: string | undefined;
    image: string;
    pageCount: string | undefined;
}

export interface VNDetail {
    id: string | null;
    title: string;
    link: string;
    desc: string;
    image: string;
    year: string;
    avgRating: string;
    totalVotes: string;
}

export interface HowLongToBeatEntry {
    id: string;
    name: string;
    imageUrl: string;
    timeLabels: Array<string[]>;
    gameplayMain: number;
    gameplayMainExtra: number;
    gameplayCompletionist: number;
    similarity: number;
}

export interface Event {
    timeout: NodeJS.Timeout;
    embed: MessageEmbed;
    title: string | undefined;
    host: string;
}

export interface Source {
    id: string;
    name: string;
}

export interface Article {
    source: Source;
    author: string;
    title: string;
    description: string;
    url: string;
    urlToImage: string;
    publishedAt: string;
    content: string;
}

export interface EmbedField {
    name: string;
    value: string;
}

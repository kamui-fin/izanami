import {
    GuildMember,
    Role,
    Message,
    MessageEmbed,
    Collection,
} from "discord.js";

export enum MediaType {
    ANIME,
    MANGA,
    DRAMA,
    LIGHT_NOVEL,
    VISUAL_NOVEL,
}

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

export interface AnilistRecommendation {
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
    length: string;
}

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
    title: string;
    description: string;
    episodes: string;
    rank: string;
    score: string;
    picture: string;
    aired: string;
    genres: string;
}

export interface UserInfo {
    user: GuildMember;
    roles: Collection<string, Role>;
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
export interface SearchResult {
    id: string;
    title: string;
    page: string;
    path?: string;
}

export interface LNDetail {
    id: string;
    title: string;
    author: string;
    link: string;
    desc: string;
    image: string;
    pageCount: string;
}

export interface VNDetail {
    id: string;
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
    title: string;
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

import {
    Role,
    Channel,
    Client,
    MessageEmbed,
    TextChannel,
    Message,
    Collection,
    PartialGuildMember,
    GuildMember,
    ColorResolvable,
} from "discord.js";
import axios, { AxiosResponse } from "axios";
import Keyv from "keyv";
import {
    AnilistRecommendation,
    Command,
    FinishInfo,
    Show,
    EmbedField,
    MediaType,
    Article,
} from "../types";
import KotobaListener from "./kotobaListener";
import EventHelper from "./eventHelper";
import {
    BUMP_INTERVAL,
    ERROR_COLOR,
    EVENT_CHANNEL,
    EVENT_CLIENT_ROLE,
    GENERAL_CHANNEL,
    MEDIA_CHANNEL,
    NEWS_INTERVAL,
    ORANGE_COLOR,
    ROLES_CHANNEL,
    RULES_CHANNEL,
    SERVER,
    SUCCESS_COLOR,
} from "../config";

const keyv = new Keyv();

export const welcome = (
    member: GuildMember | PartialGuildMember,
    channel: string,
    title: string,
    description: string
): void => {
    const txtChannel: Channel | undefined = member.guild.channels.cache.get(
        channel
    );
    if (member.user) {
        const welcomeEmbed = new MessageEmbed()
            .setTitle(title)
            .setDescription(description)
            .setColor(ORANGE_COLOR);
        if (txtChannel instanceof TextChannel)
            txtChannel.send({ embeds: [welcomeEmbed] });
    }
};

export const sendGraphQL = async (
    baseUrl: string,
    query: string,
    variables: Record<string, unknown>
): Promise<AxiosResponse> => {
    const res: AxiosResponse<unknown> = await axios({
        url: baseUrl,
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
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

export const fixDesc = (text: string, limitChars: number): string => {
    let desc = text.replace(/<br>/g, "");
    if (desc.length > limitChars) {
        desc = `${desc.slice(0, limitChars)}...`;
    }
    return desc;
};

export const getDurationAnilist = (
    media: AnilistRecommendation,
    mediaType: MediaType
): EmbedField => {
    const name = mediaType === MediaType.MANGA ? "Volumes" : "Episodes";
    return {
        name,
        value: media.length || "Unknown",
    };
};

export const getAnilistEmbed = (
    media: AnilistRecommendation,
    mediaType: MediaType
): MessageEmbed => {
    const embed = new MessageEmbed()
        .setTitle(media.title.native)
        .setDescription(media.description)
        .setURL(media.siteUrl)
        .setColor(media.coverImage.color as ColorResolvable)
        .setFooter(
            `Started ${media.startDate.month}/${media.startDate.day}/${media.startDate.year}`
        )
        .setImage(media.coverImage.large)
        .setFields([
            {
                name: "Genres",
                value: media.genres ? media.genres.join(", ") : "Unknown",
            },
            getDurationAnilist(media, mediaType),
            {
                name: "Favorites",
                value: media.favourites.toLocaleString(),
                inline: true,
            },
            {
                name: "Average Score",
                value: fixAvgScore(media.averageScore),
                inline: true,
            },
            {
                name: "Popularity",
                value: media.popularity.toLocaleString(),
                inline: true,
            },
        ]);
    return embed;
};

export const getEventEmbed = (
    media: AnilistRecommendation | Show,
    eventEpisodes: string,
    date: string,
    timeOfEvent: string,
    userID: string
): MessageEmbed => {
    let image;
    let color;
    let title;

    image = (media as AnilistRecommendation).coverImage.large;
    title = (media as AnilistRecommendation).title.native;
    color = (media as AnilistRecommendation).coverImage.color;

    const embed = new MessageEmbed()
        .setTitle("Event Scheduled")
        .setColor(color as ColorResolvable)
        .setImage(image || "")
        .addFields([
            {
                name: "Show",
                value: title,
            },
            {
                name: "Event Time",
                value: `${`${date} ${timeOfEvent}`} CT`,
            },
            {
                name: "Episodes",
                value: eventEpisodes,
                inline: true,
            },
            {
                name: "Host",
                value: `<@${userID}>`,
                inline: true,
            },
        ]);
    return embed;
};

export const splitCommand = (text: string): string[] | null => {
    const splitted = text.match(/(?:[^\s"]+|"[^"]*")+/g);
    return splitted && splitted.filter((el: string) => el.trim() !== "");
};

export const checkValidCommand = (
    cmd: string,
    commandType: Command
): boolean => {
    if (!commandType) {
        return false;
    }
    const splittedCommand = splitCommand(cmd);
    if (splittedCommand) {
        if (commandType.correctParams) {
            const validParams = commandType.correctParams();
            return validParams;
        } else {
            return true;
        }
    }
    return false;
};

export const decideRoles = (
    finishInfo: FinishInfo,
    testType: String | null,
    quizRole: Role | undefined | null,
    roleTheyHad: Role | undefined | null,
    kotoListener: KotobaListener,
    japaneseRole: Role | undefined,
    chineseRole: Role | undefined,
    memberRole: Role | undefined
): void => {
    const { user } = finishInfo.player;
    console.log(user);
    if (user) {
        if (roleTheyHad) {
            if (quizRole && japaneseRole && testType === "JLPT" && Number(quizRole.name.charAt(1)) < Number(roleTheyHad.name.charAt(1))
            ) {
                user.roles.remove(roleTheyHad);
                user.roles.add(japaneseRole);
                user.roles.add(quizRole);
            } else if (quizRole && chineseRole &&  testType === "HSK" && Number(quizRole.name.charAt(3)) > Number(roleTheyHad.name.charAt(3))
            ) {
                user.roles.remove(roleTheyHad);
                user.roles.add(chineseRole);
                user.roles.add(quizRole);
            }
        } else {
            if (quizRole) user.roles.add(quizRole);
            if (finishInfo.player.justJoined) {
                const unverifiedRole:
                    | Role
                    | undefined = kotoListener.getUnverifiedRole();
                if (unverifiedRole && memberRole) {
                    user.roles.remove(unverifiedRole);
                    user.roles.add(memberRole);
                    welcome(
                        user,
                        GENERAL_CHANNEL,
                        "Welcome to The Japan Zone!",
                        `We're glad to have you, <@${user.user.id}>! Make sure to read <#${RULES_CHANNEL}> and assign your role in <#${ROLES_CHANNEL}>`
                    );
                }
            }
        }
    }
};

const getChannel = (client: Client, id: string): Channel | null => {
    const ourServer = client.guilds.cache.get(SERVER);
    const channel = ourServer?.channels.cache.get(id);
    return channel || null;
};

const getGeneral = (client: Client): Channel | null => {
    return getChannel(client, GENERAL_CHANNEL);
};

const getEventChannel = (client: Client): Channel | null => {
    return getChannel(client, EVENT_CHANNEL);
};

const getMedia = (client: Client): Channel | null => {
    return getChannel(client, MEDIA_CHANNEL);
};

export const bumpReminder = (client: Client): void => {
    const general = getGeneral(client);

    if (general instanceof TextChannel) {
        setTimeout(() => {
            const remindEmbed: MessageEmbed = new MessageEmbed()
                .setTitle("Time to boost!")
                .setDescription(
                    `Type \`!d bump\` to keep our server up in rankings`
                )
                .setColor(SUCCESS_COLOR);

            general.send({ embeds: [remindEmbed] }).then((msg: Message) => {
                keyv.set("boostmsg", msg.id);
            });
        }, BUMP_INTERVAL);
    }
};

export const deleteBump = async (client: Client): Promise<void> => {
    const general = getGeneral(client);
    const boostKey: string = await keyv.get("boostmsg");
    if (general instanceof TextChannel) {
        const msg: Message = await general.messages.fetch(boostKey);
        msg.delete();
    }
};

export const fetchEvents = async (client: Client): Promise<Message[]> => {
    const events = getEventChannel(client);
    const currentEvents: Message[] = [];
    if (events instanceof TextChannel) {
        const messages: Collection<
            string,
            Message
        > = await events.messages.fetch({
            limit: 20,
        });
        messages.forEach((msg: Message) => {
            if (msg.embeds) {
                currentEvents.push(msg);
            }
        });
    }
    return currentEvents;
};

export const eventStarter = (
    embed: Record<string, unknown>,
    date: Date,
    channel: Channel | undefined
): void => {
    const etaMS: number = date.getTime() - Date.now();
    if (channel instanceof TextChannel) {
        setTimeout(() => {
            channel.send(`<@&${EVENT_CLIENT_ROLE}>`);
            channel.send({ embeds: [embed] });
        }, etaMS);
    }
};

export const notFoundEmbed = (msg: Message): void => {
    const nfEmbed = new MessageEmbed()
        .setTitle(`Not found`)
        .setDescription("Please refine your search and try again")
        .setColor(ERROR_COLOR);
    msg.channel.send({ embeds: [nfEmbed] });
};

export const notValidEmbed = (msg: Message): void => {
    const invalidEmbed = new MessageEmbed()
        .setTitle(`Invalid Permissions`)
        .setDescription("You do not have permissions to run this command.")
        .setColor(ERROR_COLOR);
    msg.channel.send({ embeds: [invalidEmbed] });
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

const getRandomNews = async (): Promise<string> => {
    const url = `https://newsapi.org/v2/top-headlines?country=jp&apiKey=${process.env.NEWSAPI_KEY}`;
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
        }, NEWS_INTERVAL);
    }
};

export const checkEvents = async (
    client: Client,
    eventHelper: EventHelper
): Promise<void> => {
    const events = await fetchEvents(client);
    const cancelledEvents: string[] = [];
    const rescheduledEvents: string[] = [];

    // Finds cancelled events and rescheduled events
    events.forEach((event) => {
        const [embed] = event.embeds;
        if (embed === undefined) {
            return;
        }
        const { title } = embed;
        const eventTitle = embed.fields.find((el) =>
            el.name.startsWith("Show")
        );
        if (title?.includes("Event Cancelled") && eventTitle) {
            cancelledEvents.push(eventTitle.value);
        } else if (title?.includes("Event Rescheduled") && eventTitle) {
            rescheduledEvents.push(eventTitle.value);
        }
    });

    // Sets up events again (if not cancelled)
    events.forEach((event) => {
        const [embed] = event.embeds;
        if (embed === undefined) {
            return;
        }
        const { title } = embed;
        const [isSchedule, isReschedule] = [
            title?.includes("Scheduled"),
            title?.includes("Rescheduled"),
        ];
        if (isSchedule || isReschedule) {
            const eventTitle = embed?.fields.find((el) =>
                el.name.startsWith("Show")
            );
            const findEventTime = embed?.fields.find((el) =>
                el.name.startsWith("Event Time")
            );
            const eventTime = findEventTime?.value.substring(
                0,
                findEventTime?.value.length - 4
            );
            const eventDate = eventTime ? new Date(eventTime) : new Date();
            if (eventTitle && eventDate.getTime() > Date.now()) {
                if (isSchedule) {
                    if (
                        !rescheduledEvents.includes(eventTitle.value) &&
                        !cancelledEvents.includes(eventTitle.value)
                    ) {
                        eventHelper.reallocateEvent(event, eventDate, embed);
                    }
                } else if (isReschedule) {
                    if (!cancelledEvents.includes(eventTitle.value)) {
                        eventHelper.reallocateEvent(event, eventDate, embed);
                    }
                }
            }
        }
    });
};

export const removeQuotes = (input: string): string => {
    if (!input) return input;
    const first = input[0];
    const last = input[input.length - 1];
    if (first === '"' && last === '"') {
        return input.slice(1, -1);
    }
    return input;
};

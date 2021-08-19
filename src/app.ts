import "dotenv/config";
import Discord from "discord.js";
import AniRecommender from "./commands/media/recommend/anime";
import Help from "./commands/help";
import AniInfo from "./commands/media/info/anime";
import KotobaListener from "./utils/kotobaListener";
import {
    checkValidCommand,
    splitCommand,
    decideRoles,
    bumpReminder,
    deleteBump,
    setupRandomNewsFeed,
    checkEvents,
    welcome,
} from "./utils";
import { Command } from "./types";
import MangaRecommender from "./commands/media/recommend/manga";
import MangaInfo from "./commands/media/info/manga";
import VNInfo from "./commands/media/info/vn";
import VNRecc from "./commands/media/recommend/vn";
import LNInfo from "./commands/media/info/novel";
import LNRecc from "./commands/media/recommend/novel";
import DramaInfo from "./commands/media/info/drama";
import ShowRecc from "./commands/media/recommend/drama";
import EventHelper from "./utils/eventHelper";
import RescheduleEvent from "./commands/events/reschedule";
import CreateEvent from "./commands/events/create";
import CancelEvent from "./commands/events/cancel";
import {
    DISBOARD_ID,
    ERROR_COLOR,
    JAPANESE_ROLE,
    JOIN_CHANNELS,
    KOTOBA_DISCRIMINATOR,
    KOTOBA_USERNAME,
    PREFIX,
    RESOURCE_CHANNEL,
} from "./config";
import Schedule from "./commands/events/schedule";

const client = new Discord.Client();
let eventHelper: EventHelper;

client.on("ready", () => {
    eventHelper = new EventHelper(client);
    setupRandomNewsFeed(client);
    checkEvents(client, eventHelper);
});

client.on("message", async (msg: Discord.Message) => {
    // Command List
    if (msg.author.bot !== true && msg.content.startsWith(PREFIX)) {
        const msgText = msg.content;
        const params = splitCommand(msgText);

        if (params) {
            const [cmdName]: string = params;
            const slicedParams = params.slice(2);

            const cmds: { [key: string]: Command } = {
                "recommend-anime": new AniRecommender(slicedParams),
                "recommend-manga": new MangaRecommender(slicedParams),
                "recommend-vn": new VNRecc(slicedParams),
                "recommend-ln": new LNRecc(slicedParams),
                "recommend-drama": new ShowRecc(slicedParams),
                "info-anime": new AniInfo(slicedParams),
                "info-ln": new LNInfo(slicedParams),
                "info-manga": new MangaInfo(slicedParams),
                "info-vn": new VNInfo(slicedParams),
                "info-drama": new DramaInfo(slicedParams),
                "create-event": new Schedule(slicedParams, eventHelper),
                "reschedule-event": new Schedule(
                    slicedParams,
                    eventHelper,
                    true
                ),
                "cancel-event": new CancelEvent(eventHelper),
                help: new Help(),
            };

            const chosenCmd = cmds[cmdName];

            if (!checkValidCommand(msgText, "!", chosenCmd)) {
                const cmdErrorEmbed = new Discord.MessageEmbed()
                    .setColor(ERROR_COLOR)
                    .setTitle("Invalid command")
                    .setDescription(
                        `Try \`${PREFIX}\` for instructions on how to use this bot`
                    );
                msg.channel.send(cmdErrorEmbed);
                return;
            }
            chosenCmd.run(msg);
        }
    }

    // JLPT quiz barrier logic
    if (
        msg.author.username === KOTOBA_USERNAME &&
        msg.author.discriminator === KOTOBA_DISCRIMINATOR &&
        msg.author.bot
    ) {
        const kotoListener = new KotobaListener(msg);
        if (kotoListener.hasGameEnded()) {
            const finishInfo = kotoListener.getFinishInfo();

            if (finishInfo.answeredRight >= finishInfo.player.needToGetRight) {
                const jlptRoleTheyHad = KotobaListener.getJlptRoleTheyHad(
                    finishInfo.player
                );

                const quizRole = kotoListener.getQuizRole();
                const japaneseRole = msg.guild.roles.cache.get(JAPANESE_ROLE);
                decideRoles(
                    finishInfo,
                    quizRole,
                    jlptRoleTheyHad,
                    kotoListener,
                    japaneseRole
                );
            }
        }
    }

    if (msg.author.id === DISBOARD_ID && msg.embeds) {
        const [embed] = msg.embeds;
        if (embed.description.includes("Bump done")) {
            deleteBump(client);
            bumpReminder(client);
        }
    }
});

// welcome message
client.on("guildMemberAdd", (member) => {
    JOIN_CHANNELS.forEach((id) => {
        welcome(
            member,
            id,
            `Welcome to The Japan Zone, ${member.user?.username}!`,
            `To gain access to the server, type \`k!quiz n5\` and miss 3 or less on the N5 quiz. Good luck! 
       If you are new to Japanese, we suggest reading a guide in <#${RESOURCE_CHANNEL}>`
        );
    });
});

client.login(process.env.BOT_TOKEN);

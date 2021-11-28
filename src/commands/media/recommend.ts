import { Message, MessageEmbed } from "discord.js";
import {
    Command,
    AnilistRecommendation,
    TopLevel,
    MediaType,
} from "../../types";
import {
    getAnilistEmbed,
    fixDesc,
    shuffleArray,
    notFoundEmbed,
    removeQuotes,
} from "../../utils";
import * as anilist from "../../utils/anilist";

class MediaRecommender implements Command {
    stringParams: string[];

    limit = 1;

    mediaType: MediaType;

    query: string;

    starFilter = 0;

    constructor(prms: string[], mediaType: MediaType) {
        this.query = removeQuotes(prms[0]);
        this.stringParams = prms;
        this.mediaType = mediaType;
    }

    correctParams(): boolean {
        const limitRecs = this.stringParams[1];
        const starFilter = this.stringParams[2];

        if (this.query) {
            if (limitRecs) {
                if (
                    !Number.isNaN(Number(limitRecs)) &&
                    Number(limitRecs) <= 5 &&
                    Number(limitRecs) > 0
                ) {
                    this.limit = Number(limitRecs);
                }
            } else {
                this.limit = 1;
            }

            if (starFilter) {
                const parsed = Number(starFilter.replace(/star_/g, ""));
                if (!Number.isNaN(parsed) && parsed <= 10 && parsed >= 0) {
                    this.starFilter = parsed;
                }
            } else {
                this.starFilter = 0;
            }
            return true;
        }
        return false;
    }

    async getAnilistRecommendations(): Promise<MessageEmbed[]> {
        const embeds: MessageEmbed[] = [];
        const reccs = await anilist.getReccomendations(
            this.mediaType,
            this.query,
            this.limit
        );
        shuffleArray(reccs);
        reccs.forEach((recc: TopLevel) => {
            const modifyedRecc: AnilistRecommendation =
                recc.node.mediaRecommendation;
            modifyedRecc.description = fixDesc(modifyedRecc.description, 300);
            const embed = getAnilistEmbed(modifyedRecc, this.mediaType);
            if (modifyedRecc.averageScore / 10 >= this.starFilter) {
                embeds.push(embed);
            }
        });
        return embeds;
    }

    async run(msg: Message): Promise<void> {
        try {
            let embeds: MessageEmbed[];
            switch (this.mediaType) {
                case MediaType.ANIME:
                case MediaType.MANGA:
                    embeds = await this.getAnilistRecommendations();
                    break;
                default:
                    embeds = [];
                    break;
            }
            embeds.forEach((e) => {
                msg.channel.send({ embeds: [e] });
            });
        } catch (error) {
            notFoundEmbed(msg);
        }
    }
}

export default MediaRecommender;

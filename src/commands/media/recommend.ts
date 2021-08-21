import { Message, MessageEmbed } from "discord.js";
import {
    Command,
    AnilistRecommendation,
    TopLevel,
    MediaType,
    Show,
    LNDetail,
    VNDetail,
} from "../../types";
import {
    getAnilistEmbed,
    fixDesc,
    shuffleArray,
    notFoundEmbed,
    getDramaEmbed,
    removeQuotes,
    getLNEmbed,
    getVNEmbed,
    findGameDurationInfo,
} from "../../utils";
import * as bookmeter from "../../utils/bookmeter";
import * as vnstat from "../../utils/vnstat";
import * as anilist from "../../utils/anilist";
import * as dramalist from "../../utils/dramalist";

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

    async getDramaRecommendations(): Promise<MessageEmbed[]> {
        const embeds: MessageEmbed[] = [];
        const reccIds = (await dramalist.getInfo(
            this.query,
            null,
            true
        )) as string[];

        reccIds.slice(0, this.limit).forEach(async (recc: string) => {
            const dramaInfo = await dramalist.getInfo(recc);
            const embed = getDramaEmbed(dramaInfo as Show);
            embeds.push(embed);
        });

        return embeds;
    }

    async getLNRecommendations(): Promise<MessageEmbed[]> {
        const embeds: MessageEmbed[] = [];
        const reccIds = (await bookmeter.showDetailsForLN(
            null,
            this.query,
            true
        )) as string[];

        reccIds.slice(0, this.limit).forEach(async (recc: string) => {
            const lnInfo = await bookmeter.showDetailsForLN(recc);
            const embed = getLNEmbed(lnInfo as LNDetail);
            embeds.push(embed);
        });
        return embeds;
    }

    async getVNRecommendations(): Promise<MessageEmbed[]> {
        const embeds: MessageEmbed[] = [];
        const reccIds = (await vnstat.showDetailsForVN(
            null,
            this.query,
            true
        )) as string[];

        shuffleArray(reccIds)
            .slice(0, this.limit)
            .forEach(async (recc: string) => {
                const vnInfo = await vnstat.showDetailsForVN(recc);
                const playTime = await findGameDurationInfo(
                    (vnInfo as VNDetail).title
                );
                const embed = getVNEmbed(vnInfo as VNDetail, playTime);
                embeds.push(embed);
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
                case MediaType.DRAMA:
                    embeds = await this.getDramaRecommendations();
                    break;
                case MediaType.LIGHT_NOVEL:
                    embeds = await this.getLNRecommendations();
                    break;
                case MediaType.VISUAL_NOVEL:
                    embeds = await this.getVNRecommendations();
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

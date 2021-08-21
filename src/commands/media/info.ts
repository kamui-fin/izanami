import { Message, MessageEmbed } from "discord.js";
import { Command, LNDetail, MediaType, Show, VNDetail } from "../../types";
import {
    findGameDurationInfo,
    fixDesc,
    getAnilistEmbed,
    getDramaEmbed,
    getLNEmbed,
    getVNEmbed,
    notFoundEmbed,
    removeQuotes,
} from "../../utils";
import * as bookmeter from "../../utils/bookmeter";
import * as vnstat from "../../utils/vnstat";
import * as anilist from "../../utils/anilist";
import * as dramalist from "../../utils/dramalist";

class MediaInfo implements Command {
    stringParams: string[];

    query: string;

    mediaType: MediaType;

    constructor(prms: string[], mediaType: MediaType) {
        this.query = removeQuotes(prms[0]);
        this.stringParams = prms;
        this.mediaType = mediaType;
    }

    correctParams(): boolean {
        return typeof this.query !== undefined;
    }

    async getAnilistInfo(): Promise<MessageEmbed> {
        const res = await anilist.getInfo(this.mediaType, this.query);
        res.description = fixDesc(res.description, 300);
        const embed = getAnilistEmbed(res, this.mediaType);
        return embed;
    }

    async getDramaInfo(): Promise<MessageEmbed> {
        const res = await dramalist.getInfo(this.query);
        const embed = getDramaEmbed(res as Show);
        return embed;
    }

    async getLNInfo(): Promise<MessageEmbed> {
        const details = await bookmeter.showDetailsForLN(null, this.query);
        const embed = getLNEmbed(details as LNDetail);
        return embed;
    }

    async getVNInfo(): Promise<MessageEmbed> {
        const details = await vnstat.showDetailsForVN(null, this.query);
        const playTime = await findGameDurationInfo(this.query);
        const embed = getVNEmbed(details as VNDetail, playTime);
        return embed;
    }

    async run(msg: Message): Promise<void> {
        try {
            let embed;
            switch (this.mediaType) {
                case MediaType.ANIME:
                case MediaType.MANGA:
                    embed = await this.getAnilistInfo();
                    break;
                case MediaType.DRAMA:
                    embed = await this.getDramaInfo();
                    break;
                case MediaType.LIGHT_NOVEL:
                    embed = await this.getLNInfo();
                    break;
                case MediaType.VISUAL_NOVEL:
                    embed = await this.getVNInfo();
                    break;
                default:
                    throw new Error();
            }
            msg.channel.send({ embeds: [embed] });
        } catch (error) {
            notFoundEmbed(msg);
        }
    }
}

export default MediaInfo;

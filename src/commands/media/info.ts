import { Message, MessageEmbed } from "discord.js";
import { Command, MediaType } from "../../types";
import {
    fixDesc,
    getAnilistEmbed,
    notFoundEmbed,
    removeQuotes,
} from "../../utils";
import * as anilist from "../../utils/anilist";

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

    async run(msg: Message): Promise<void> {
        try {
            let embed;
            switch (this.mediaType) {
                case MediaType.ANIME:
                case MediaType.MANGA:
                    embed = await this.getAnilistInfo();
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

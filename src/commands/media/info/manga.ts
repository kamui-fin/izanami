import { Message } from "discord.js";
import { Command } from "../../../types";
import { getAnilistEmbed, fixDesc, notFoundEmbed } from "../../../utils";
import * as anilist from "../../../utils/anilist";

class MangaInfo implements Command {
    stringParams: string[];

    constructor(prms: string[]) {
        this.stringParams = prms;
    }

    correctParams(): boolean {
        const fromManga = this.stringParams[0];
        return typeof fromManga !== undefined;
    }

    async run(msg: Message): Promise<void> {
        try {
            const res = await anilist.getInfo(this.stringParams[0], "MANGA");
            res.description = fixDesc(res.description, 300);
            const embed = getAnilistEmbed(res);
            msg.channel.send({ embed });
        } catch (error) {
            notFoundEmbed(msg, "Manga");
        }
    }
}

export default MangaInfo;

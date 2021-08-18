import { Message } from "discord.js";
import { Command, Show } from "../../../types";
import { notFoundEmbed, getDramaEmbed } from "../../../utils";
import * as dramalist from "../../../utils/dramalist";

class DramaInfo implements Command {
    stringParams: string[];

    constructor(prms: string[]) {
        this.stringParams = prms;
    }

    correctParams(): boolean {
        const fromDrama = this.stringParams[0];
        return typeof fromDrama !== undefined;
    }

    async run(msg: Message): Promise<void> {
        try {
            const res = await dramalist.getInfo(this.stringParams[0].slice(1, -1));
            const embed = getDramaEmbed(res as Show);
            msg.channel.send({ embed });
        } catch (error) {
            notFoundEmbed(msg, "Drama");
        }
    }
}

export default DramaInfo;

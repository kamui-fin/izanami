import { Message } from "discord.js";
import { Command, Show } from "../../../types";
import { notFoundEmbed, getDramaEmbed } from "../../../utils";
import * as dramalist from "../../../utils/dramalist";

class ShowRecc implements Command {
    stringParams: string[];

    limit = 1;

    constructor(prms: string[]) {
        this.stringParams = prms;
    }

    correctParams(): boolean {
        const fromShow = this.stringParams[0];
        const limitRecs = this.stringParams[1];

        if (fromShow) {
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

            return true;
        }
        return false;
    }

    async run(msg: Message): Promise<void> {
        try {
            const reccIds = await dramalist.getInfo(this.stringParams[0].slice(1, -1), null, true);
            (reccIds as string[])
                .slice(0, this.limit)
                .forEach(async (recc: string) => {
                    const dramaInfo = await dramalist.getInfo(recc);
                    const embed = getDramaEmbed(dramaInfo as Show);
                    msg.channel.send({ embed });
                });
        } catch (error) {
            notFoundEmbed(msg, "Show");
        }
    }
}

export default ShowRecc;

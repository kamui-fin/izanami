import { Message } from "discord.js";
import { Command, LNDetail } from "../../../types";
import { getLNEmbed, notFoundEmbed } from "../../../utils";
import * as bookmeter from "../../../utils/bookmeter";

class LNInfo implements Command {
    stringParams: string[];

    constructor(prms: string[]) {
        this.stringParams = prms;
    }

    correctParams(): boolean {
        const fromLN = this.stringParams[0];
        return typeof fromLN !== undefined;
    }

    async run(msg: Message): Promise<void> {
        try {
            const details = await bookmeter.showDetailsForLN(
                null,
                this.stringParams[0].slice(1, -1)
            );
            const embed = getLNEmbed(details as LNDetail);
            msg.channel.send({ embed });
        } catch (error) {
            notFoundEmbed(msg, "Light Novel");
        }
    }
}

export default LNInfo;

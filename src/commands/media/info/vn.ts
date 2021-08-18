import { Message } from "discord.js";
import { Command, VNDetail } from "../../../types";
import { findGameDurationInfo, getVNEmbed, notFoundEmbed } from "../../../utils";
import * as vnstat from "../../../utils/vnstat";

class VNInfo implements Command {
    stringParams: string[];

    constructor(prms: string[]) {
        this.stringParams = prms;
    }

    correctParams(): boolean {
        const fromVN = this.stringParams[0];
        return typeof fromVN !== undefined;
    }

    async run(msg: Message): Promise<void> {
        try {
            const details = await vnstat.showDetailsForVN(
                null,
                this.stringParams[0].slice(1, -1)
            );
            const playTime = await findGameDurationInfo(this.stringParams[0].slice(1, -1));
            const embed = getVNEmbed(details as VNDetail, playTime);
            msg.channel.send({ embed });
        } catch (error) {
            notFoundEmbed(msg, "Visual Novel");
        }
    }
}

export default VNInfo;

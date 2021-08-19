import { Message } from "discord.js";
import { Command, VNDetail } from "../../../types";
import * as vnstat from "../../../utils/vnstat";
import {
    findGameDurationInfo,
    getVNEmbed,
    notFoundEmbed,
    shuffleArray,
} from "../../../utils";

class VNRecc implements Command {
    stringParams: string[];

    limit = 1;

    constructor(prms: string[]) {
        this.stringParams = prms;
    }

    correctParams(): boolean {
        const fromVN = this.stringParams[0];
        const limitRecs = this.stringParams[1];

        if (fromVN) {
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
            const reccIds = await vnstat.showDetailsForVN(
                null,
                this.stringParams[0].slice(1, -1),
                true
            );
            shuffleArray(reccIds as string[])
                .slice(0, this.limit)
                .forEach(async (recc: string) => {
                    const vnInfo = await vnstat.showDetailsForVN(recc, "");
                    const playTime = await findGameDurationInfo(
                        (vnInfo as VNDetail).title
                    );
                    const embed = getVNEmbed(vnInfo as VNDetail, playTime);
                    msg.channel.send({ embed });
                });
        } catch (error) {
            notFoundEmbed(msg, "Visual Novel");
        }
    }
}

export default VNRecc;

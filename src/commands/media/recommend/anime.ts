import { Message } from "discord.js";
import { Command, AnilistRecommendation, TopLevel } from "../../../types";
import {
    getAnilistEmbed,
    fixDesc,
    shuffleArray,
    notFoundEmbed,
} from "../../../utils";
import * as anilist from "../../../utils/anilist";

class AniRecommender implements Command {
    stringParams: string[];

    limit = 1;

    starFilter = 0;

    constructor(prms: string[]) {
        this.stringParams = prms;
    }

    correctParams(): boolean {
        const fromAnime = this.stringParams[0];
        const limitRecs = this.stringParams[1];
        const starFilter = this.stringParams[2];

        if (fromAnime) {
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

    async run(msg: Message): Promise<void> {
        try {
            const reccs = await anilist.getReccomendations(
                "ANIME",
                this.stringParams[0],
                this.limit
            );
            shuffleArray(reccs);

            reccs.forEach((recc: TopLevel) => {
                const modifyedRecc: AnilistRecommendation =
                    recc.node.mediaRecommendation;
                modifyedRecc.description = fixDesc(
                    modifyedRecc.description,
                    300
                );
                const embed = getAnilistEmbed(modifyedRecc);
                if (modifyedRecc.averageScore / 10 >= this.starFilter) {
                    msg.channel.send({ embed });
                }
            });
        } catch (error) {
            notFoundEmbed(msg, "Recommendation");
        }
    }
}

export default AniRecommender;

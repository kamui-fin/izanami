import { Message } from "discord.js";
import { Command, AnilistRecommendation, MediaType } from "../../types";
import {
    fixDesc,
    getEventEmbed,
    notValidEmbed,
    removeQuotes,
} from "../../utils";
import { EVENT_HOST_ROLE } from "../../config";
import EventHelper from "../../utils/eventHelper";
import * as anilist from "../../utils/anilist";

class Schedule implements Command {
    stringParams: string[];

    eventHelper: EventHelper;

    reschedule: boolean;

    query: string;

    constructor(prms: string[], eventHelper: EventHelper, reschedule = false) {
        this.stringParams = prms;
        this.eventHelper = eventHelper;
        this.reschedule = reschedule;
        this.query = removeQuotes(prms[0]);
    }

    async run(msg: Message): Promise<void> {
        if (msg.member?.roles.cache.has(EVENT_HOST_ROLE)) {
            const res = (await anilist.getInfo(
                MediaType.ANIME,
                this.query
            )) as AnilistRecommendation;
            res.description = fixDesc(res.description || "", 300);
            const episodesToStream = this.stringParams[1];
            const mmddyyyy = this.stringParams[2];
            const time = this.stringParams[3];
            const date = new Date(`${`${mmddyyyy} ${time}`}`);
            const embed = getEventEmbed(
                res,
                episodesToStream,
                mmddyyyy,
                time,
                msg.author.id
            );
            if (this.reschedule) {
                this.eventHelper.rescheduleEvent(msg, date, embed);
            } else {
                this.eventHelper.addEvent(msg, date, embed);
            }
        } else {
            notValidEmbed(msg);
        }
    }
}

export default Schedule;

import { Message } from "discord.js";
import { Command, AnilistRecommendation, Show, MediaType } from "../../types";
import {
    fixDesc,
    getEventEmbed,
    notValidEmbed,
    removeQuotes,
} from "../../utils";
import { EVENT_HOST_ROLE } from "../../config";
import EventHelper from "../../utils/eventHelper";
import * as anilist from "../../utils/anilist";
import * as dramalist from "../../utils/dramalist";

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

    correctParams(): boolean {
        const type = this.stringParams[1];
        return (
            typeof this.query !== undefined && ["drama", "anime"].includes(type)
        );
    }

    async run(msg: Message): Promise<void> {
        if (msg.member?.roles.cache.has(EVENT_HOST_ROLE)) {
            let res: AnilistRecommendation | Show;
            if (this.stringParams[1] === "anime") {
                res = (await anilist.getInfo(
                    MediaType.ANIME,
                    this.query
                )) as AnilistRecommendation;
            } else {
                res = (await dramalist.getInfo(this.query)) as Show;
            }
            res.description = fixDesc(res.description || "", 300);
            const episodesToStream = this.stringParams[2];
            const mmddyyyy = this.stringParams[3];
            const time = this.stringParams[4];
            const date = new Date(`${`${mmddyyyy} ${time}`}`);
            const embed = getEventEmbed(
                res,
                episodesToStream,
                mmddyyyy,
                time,
                msg.author.id,
                this.stringParams[1] === "anime"
                    ? MediaType.ANIME
                    : MediaType.DRAMA
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

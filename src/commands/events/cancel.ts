import { Message } from "discord.js";
import { EVENT_HOST_ROLE } from "../../config";
import { Command } from "../../types";
import { notValidEmbed } from "../../utils";
import EventHelper from "../../utils/eventHelper";

class CancelEvent implements Command {
    eventHelper: EventHelper;

    constructor(eventHelper: EventHelper) {
        this.eventHelper = eventHelper;
    }

    run(msg: Message): void {
        if (msg.member?.roles.cache.has(EVENT_HOST_ROLE)) {
            this.eventHelper.cancelEvent(msg);
        } else {
            notValidEmbed(msg);
        }
    }
}

export default CancelEvent;

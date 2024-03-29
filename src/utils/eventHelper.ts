import { TextChannel, Message, MessageEmbed, Client } from "discord.js";
import { Event } from "../types";
import {
    ERROR_COLOR,
    EVENT_CHANNEL,
    EVENT_CLIENT_ROLE,
    SERVER,
} from "../config";

class EventHelper {
    eventData: Event[];

    client: Client;

    eventChannel: TextChannel | null;

    constructor(client: Client) {
        this.eventData = [];
        this.client = client;
        this.eventChannel = this.getEventChannel();
    }

    sendEventEmbed(embed: MessageEmbed): void {
        if (this.eventChannel) {
            this.eventChannel.send(`<@&${EVENT_CLIENT_ROLE}>`);
            this.eventChannel.send({ embeds: [embed] });
        }
    }

    reallocateEvent(msg: Message, date: Date, embed: MessageEmbed): void {
        const title = embed.title || "";
        const etaMS = date.getTime() - Date.now();
        const timeout = setTimeout(() => {
            embed.setTitle("Event Started");
            this.sendEventEmbed(embed);
        }, etaMS);
        const { id } = msg.author;
        this.eventData.push({
            timeout,
            embed,
            title,
            host: id,
        });
    }

    addEvent(
        msg: Message,
        date: Date,
        embed: MessageEmbed,
        reschedule = false
    ): void {
        this.reallocateEvent(msg, date, embed);
        if (reschedule) {
            embed.setTitle("Event Rescheduled");
        }
        this.sendEventEmbed(embed);
    }

    cancelEvent(msg: Message, verbose = true): void {
        const events = this.eventData.filter(
            (evnt) => evnt.host === msg.author.id
        );
        events.forEach((event) => {
            if (event?.timeout) {
                clearTimeout(event.timeout);
                this.eventData = [];
                if (this.eventChannel instanceof TextChannel) {
                    const showName = event.embed.fields.find(
                        (fld) => fld.name === "Show"
                    )?.value;
                    if (showName && verbose) {
                        const cancelEmbed = new MessageEmbed()
                            .setTitle(`Event Cancelled`)
                            .setColor(ERROR_COLOR)
                            .addField("Show", showName)
                            .addField("Host", `<@${event.host}>`);
                        this.sendEventEmbed(cancelEmbed);
                    }
                }
            }
        });
    }

    rescheduleEvent(msg: Message, date: Date, embed: MessageEmbed): void {
        this.cancelEvent(msg, false);
        this.addEvent(msg, date, embed, true);
    }

    getEventChannel(): TextChannel | null {
        const ourServer = this.client.guilds.cache.get(SERVER);
        const eventChannel = ourServer?.channels.cache.get(EVENT_CHANNEL);
        if (eventChannel instanceof TextChannel) {
            return eventChannel as TextChannel;
        }
        return null;
    }
}

export default EventHelper;

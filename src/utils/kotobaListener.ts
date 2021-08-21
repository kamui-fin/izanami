import { Message, Role, GuildMember } from "discord.js";
import { FinishInfo, UserInfo, FinishEmbedMatch } from "../types";

class KotobaListener {
    private kMessage: Message;

    private titlere = /JLPT (N[1-5]) Reading Quiz Ended/;

    private descre =
        /The score limit of 10 was reached by <@(\d*)>. Congratulations!/;

    private finishEmbedMatch: FinishEmbedMatch | null;

    public constructor(msg: Message) {
        this.kMessage = msg;
        this.finishEmbedMatch = this.getFinishEmbedMatch();
    }

    getPlayerInfo(): UserInfo | null {
        let userWhoPassed: GuildMember | undefined;
        if (this.finishEmbedMatch?.descMatch) {
            userWhoPassed = this.kMessage.guild?.members.cache.get(
                this.finishEmbedMatch.descMatch[1]
            );
        }
        const rolesTheyHad = userWhoPassed?.roles.cache;
        const userJustJoined = !!rolesTheyHad?.find(
            (e) => e.name === "Unverified"
        );
        const needToGetRight = userJustJoined ? 7 : 10;

        if (!userWhoPassed || !rolesTheyHad) {
            return null;
        }
        return {
            user: userWhoPassed,
            roles: rolesTheyHad,
            justJoined: userJustJoined,
            needToGetRight,
        };
    }

    hasGameEnded(): boolean {
        return (
            !!this.finishEmbedMatch?.titleMatch &&
            !!this.finishEmbedMatch?.descMatch
        );
    }

    getFinishEmbedMatch(): FinishEmbedMatch | null {
        const { title, description } = this.kMessage.embeds[0];

        if (!!title && !!description) {
            const matchedTitle = title.match(this.titlere);
            const matchedDescription = description.match(this.descre);
            if (matchedTitle && matchedDescription) {
                return {
                    titleMatch: matchedTitle,
                    descMatch: matchedDescription,
                };
            }
        }
        return null;
    }

    getFinishInfo(): FinishInfo | null {
        let nLevel: number | null = null;
        if (this.finishEmbedMatch?.titleMatch !== null) {
            nLevel = Number(this.finishEmbedMatch?.titleMatch[1]);
        }
        const player = this.getPlayerInfo();
        const answeredRight = this.getNumAnsweredRight();
        if (!nLevel || !player) {
            return null;
        }
        return {
            quizlevel: nLevel,
            player,
            answeredRight,
        };
    }

    getNumAnsweredRight(): number {
        const flds = this.kMessage.embeds[0].fields.find((el) =>
            el.name.startsWith("Unanswered")
        );
        const numofunansweredQuestions = flds
            ? flds.value.split("\n").length
            : 0;
        return 10 - numofunansweredQuestions;
    }

    getUnverifiedRole(): Role | undefined {
        return this.kMessage.guild?.roles.cache.find(
            (e) => e.name === "Unverified"
        );
    }

    getQuizRole(): Role | null {
        let nrole: Role | null = null;
        if (this.finishEmbedMatch?.titleMatch) {
            const n = this.finishEmbedMatch.titleMatch[1];
            nrole =
                this.kMessage.guild?.roles.cache.find(
                    (role) => role.name === n
                ) || null;
        }
        return nrole;
    }

    static getJlptRoleTheyHad(user: UserInfo): Role | null {
        return (
            user.roles?.find(
                (e) =>
                    e.name.charAt(0) === "N" &&
                    e.name.length === 2 &&
                    !Number.isNaN(Number(e.name.charAt(1)))
            ) || null
        );
    }
}

export default KotobaListener;

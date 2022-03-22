import { Message, Role, GuildMember } from "discord.js";
import { FinishInfo, UserInfo, FinishEmbedMatch } from "../types";

class KotobaListener {
    private kMessage: Message;

    private titlere = /JLPT (N[1-5]) Reading Quiz Ended/;

    private titlere2 = /^.*(HSK[1-6])(.*?)Ended/;

    private descre = /The score limit of 10 was reached by <@(\d*)>. Congratulations!/;

    private finishEmbedMatch: FinishEmbedMatch | null;

    public constructor(msg: Message) {
        this.kMessage = msg;
        this.finishEmbedMatch = this.getFinishEmbedMatch();
    }

    getPlayerInfo(): UserInfo | null {
        let userWhoPassed: GuildMember | undefined;
        if (this.finishEmbedMatch) {
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
        if (this.finishEmbedMatch) {
            return true;
        }
        return false;
    }

    getFinishEmbedMatch(): FinishEmbedMatch | null {
        const { title, description } = this.kMessage.embeds[0];

        if (!!title && !!description) {
            const matchedTitle = title.match(this.titlere);
            const matchedTitle2 = title.match(this.titlere2);
            const matchedDescription = description.match(this.descre);
            if ((matchedTitle || matchedTitle2) && matchedDescription) {
                if(matchedTitle) {
                    return {
                        titleMatch: matchedTitle,
                        descMatch: matchedDescription,
                    };
                }
                else if(matchedTitle2){
                return {
                    titleMatch: matchedTitle2,
                    descMatch: matchedDescription,
                }};
            }
        }
        return null;
    }

    getFinishInfo(): FinishInfo | null {
        let level: string | null = null;
        let type: string = "";

        if (this.finishEmbedMatch) {
            if (this.finishEmbedMatch.titleMatch[1].charAt(0) === 'H') {
              type = "HSK";
              level = this.finishEmbedMatch.titleMatch[1].charAt(3);
            } else {
              type = "JLPT";
              level = this.finishEmbedMatch.titleMatch[1].charAt(1);
            }
        }

        console.log(level);
        const player = this.getPlayerInfo();
        const answeredRight = this.getNumAnsweredRight();
        console.log(player, answeredRight);
        if (!level || !player) {
            return null;
        }
        return {
            testType: type,
            quizlevel: level,
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

    getUnverifiedRole(): Role | null {
        let roleFound: Role | null;
        roleFound = this.kMessage.guild?.roles.cache.find(
            (role) => role.name === "Unverified"
        ) || null;
        return roleFound;
    }

    getMemberRole(): Role | null {
        let roleFound: Role | null;
        roleFound = this.kMessage.guild?.roles.cache.find(
            (role) => role.name === "Member"
        ) || null;
        return roleFound;
    }

    getJapaneseRole(): Role | null {
        let roleFound: Role | null = null;
        roleFound = this.kMessage.guild?.roles.cache.find(
            (role) => role.name === "Japanese Learner"
        ) || null;
        return roleFound;
    }

    getChineseRole(): Role | null {
        let roleFound: Role | null;
        roleFound = this.kMessage.guild?.roles.cache.find(
            (role) => role.name === "Chinese Learner"
        ) || null;
        return roleFound;
    }

    getQuizRole(): Role | null {
        let nrole: Role | null;
        if (this.finishEmbedMatch?.titleMatch) {
            const n = this.finishEmbedMatch.titleMatch[1];
            nrole =
                this.kMessage.guild?.roles.cache.find(
                    (role) => role.name === n
                ) || null;
        }
        return nrole;
    }

    static getRoleTheyHad(user: UserInfo): Role | null {
        return (user.roles?.find(
            (e) =>
                e.name.charAt(0) === "H" &&
                e.name.length === 4 &&
                !Number.isNaN(Number(e.name.charAt(3)))
        ) ||
        user.roles?.find(
            (f) =>
                f.name.charAt(0) === "N" &&
                f.name.length === 2 &&
                !Number.isNaN(Number(f.name.charAt(1)))
        ) || null)
    }
}

export default KotobaListener;

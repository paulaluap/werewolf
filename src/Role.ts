import { Player } from "./Player";
export interface Role {
    firstTurnMessage: string;
    getDayMessage(): string;
    getAfternoonMessage(): string;
    getNightMessage(): string;
    player: Player;
    // When the player answers to the DM messages
    onDayMsg(msg: string): void;
    onAfternoonMsg(msg: string): void;
    onNightMsg(msg: string): void;
}

export enum RoleBookEntry {
    Villager,
    Werewolf
}

export class Villager implements Role {
    firstTurnMessage: string = `
    Du Bist ein normaler Dorfbewohner:
    des Tages kannst du mit den anderen Dorfbewohner abstimmen einen mutmasslichen werwolf hinzurichten
    `;
    dayVoteList: Player[] = []
    dayVote: Player
    getDayMessage() {
        const players = this.player.game.getAlivePlayers().filter((player) => player !== this.player)
        this.dayVote = undefined
        this.dayVoteList = players

        return "Deine Stimme ist gefragt, wen verdaechtigst du ein werwolf zu sein?" + formatPlayerChoice(this.dayVoteList)
    }
    getAfternoonMessage() {
        return ""
    }
    getNightMessage() {
        return "Du schlaefst"
    }
    constructor(public player: Player) { }
    onDayMsg(msg: string) {
        // parse the vote
        try {
            if (!this.dayVoteList) {
                throw new Error('You already voted this round')
            }
            const decision: Player = parsePlayerChoice(msg, this.dayVoteList)
            this.dayVoteList = undefined;
            this.dayVote = decision
            this.player.sendDMessage("You voted to kill " + decision.name)
        } catch (error) {
            console.error("onDayMsg parse failed", this, error)
            this.player.sendDMessage(error.message)
        }
    }
    onAfternoonMsg(msg: string) {
        // nothing to do for the villager (we don't expect anything here, so we don't parse it)
    }
    onNightMsg(msg: string) {
        this.player.sendDMessage("Ab in die Kiste! es ist schon spaet");
    }
}

export class Werewolf extends Villager {
    constructor(public player: Player) {
        super(player)
        console.log(this)
    }
    firstTurnMessage: string = `
    Du Bist ein Werwolf:
    in der Nacht kannst du mit den anderen woelfen abstimmen,
    wen ihr zusammen fressen wollt
    `;

    nightVoteList: Player[]
    nightVote: Player

    getNightMessage() {
        const players = this.player.game.getAlivePlayers()
            .filter((player) => player !== this.player) // you can't vote to kill yourself
            .filter((player) => !(player.role instanceof Werewolf))
        this.nightVote = undefined
        this.nightVoteList = players

        return "Wen wollt ihr essen?" + formatPlayerChoice(this.nightVoteList)
    }
    onNightMsg(msg: string) {
        // parse the vote
        try {
            if (!this.nightVoteList) {
                throw new Error('You already voted this round')
            }
            const decision: Player = parsePlayerChoice(msg, this.nightVoteList)
            this.nightVoteList = undefined;
            this.nightVote = decision
            this.player.sendDMessage("You voted to kill " + decision.name)
        } catch (error) {
            console.error("onNightMsg parse failed", this, error)
            this.player.sendDMessage(error.message)
        }
    }
}


function formatPlayerChoice(playerList: Player[]): string {
    const list = playerList.map((player, index) => `${index + 1}: ${player.name}`)
    return `\n${list.join('\n')}\n(Schreib die jeweilige zahl um auszuwaehlen)`
}

function parsePlayerChoice(msg: string, playerList: Player[]): Player {
    const choice = Number(msg)
    // is result number
    if (!Number.isInteger(choice)) {
        throw new Error("Choice is not a number")
    } else if (choice <= 0 || choice > playerList.length) {
        throw new Error("Choice number is out of range")
    } else {
        return playerList[choice-1]
    }
}
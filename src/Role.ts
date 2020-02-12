import { Player } from "./Player";
export interface Role {
    firstTurnMessage: string;
    dayMessage: string;
    afternoonMessage: string;
    nightMessage: string;
    player: Player;
    // When the player answers to the DM messages
    onDayMsg(msg: string);
    onAfternoonMsg(msg: string);
    onNightMsg(msg: string);
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
    dayMessage: string = "Deine Stimme ist gefragt, wen verdaechtigst du ein werwolf zu sein?";
    afternoonMessage: string = "";
    nightMessage: string = "Du schlaefst";
    constructor(public player: Player) { }
    onDayMsg(msg: string) {
        // parse the vote
    }
    onAfternoonMsg(msg: string) {
        // nothing to do for the villager (we don't expect anything here, so we don't parse it)
    }
    onNightMsg(msg: string) {
        this.player.sendDMessage("Ab in die Kiste! es ist schon spaet");
    }
}

export class Werewolf extends Villager {
    firstTurnMessage: string = `
    Du Bist ein Werwolf:
    in der Nacht kannst du mit den anderen woelfen abstimmen,
    wen ihr zusammen fressen wollt
    `;
    // todo convert these strings to funtions to allow the messages to be context aware
    // like in this case we might wanna tell the player what players they can vote for
    nightMessage: string = "Als Werewolf darfst du in der nacht voten, wen wollt ihr essen?";
    onNightMsg(msg: string) {
        // parse the vote
    }
}

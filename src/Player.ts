import { Message } from 'deltachat-node'
import { RoleBookEntry, Werewolf, Role, Villager } from './Role'
import { dc } from './Manager'
import { Game, Phase } from "./Game";

export class Player {
    alive: boolean = true;
    role: Role;
    constructor(public game: Game, public contactId: number, role: RoleBookEntry) {
        switch (role) {
            case RoleBookEntry.Villager:
                this.role = new Villager(this);
                break;
            case RoleBookEntry.Werewolf:
                this.role = new Werewolf(this);
                break;
            default:
                throw Error("Unknown Role: " + role);
        }
    }
    sendDMessage(msg: string | Message) {
        const chatid = dc.getChatIdByContactId(this.contactId);
        // TODO Do we need to create the chat if it doesn't exists?
        dc.sendMessage(chatid, msg);
    }
    kill() {
        this.alive = false;
        this.sendDMessage("Du wurdest getoetet");
    }
    sendRoleMessage(dayPhase: Phase) {
        let message: string;
        if (dayPhase === Phase.Day) {
            message = this.role.dayMessage;
        }
        else if (dayPhase === Phase.Afternoon) {
            message = this.role.afternoonMessage;
        }
        else if (dayPhase === Phase.Night) {
            message = this.role.nightMessage;
        }
        this.sendDMessage(message);
    }
    processDM(dayPhase: Phase, msg: string) {
        if (dayPhase === Phase.Day) {
            this.role.onDayMsg(msg);
        }
        else if (dayPhase === Phase.Afternoon) {
            this.role.onAfternoonMsg(msg);
        }
        else if (dayPhase === Phase.Night) {
            this.role.onNightMsg(msg);
        }
    }
}

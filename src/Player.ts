import { Message } from 'deltachat-node'
import { RoleBookEntry, Werewolf, Role, Villager } from './Role'
import { dc } from './Manager'
import { Game, Phase } from "./Game";

export class Player {
    alive: boolean = true;
    role: Role;
    name:string;
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
        this.name = dc.getContact(this.contactId).getName()
    }
    sendDMessage(msg: string | Message) {
        const chatid = dc.createChatByContactId(this.contactId)
        dc.sendMessage(chatid, msg);

        console.log(this.name + ":", msg);
    }
    kill() {
        this.alive = false;
        this.sendDMessage("Du wurdest getoetet");
    }

    sendFirstTurnMessage() {
        this.sendDMessage(this.role.firstTurnMessage)
    }

    sendRoleMessage(dayPhase: Phase) {
        if(!this.alive){
            // player is dead, send no role message
            return;
        }
        let message: string;
        if (dayPhase === Phase.Day) {
            message = this.role.getDayMessage();
        }
        else if (dayPhase === Phase.Afternoon) {
            message = this.role.getAfternoonMessage();
        }
        else if (dayPhase === Phase.Night) {
            message = this.role.getNightMessage();
        }
        if (message && message !== '') {
            this.sendDMessage(message);
        }
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

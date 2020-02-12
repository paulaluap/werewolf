import { Message } from 'deltachat-node'
import { delay } from './util'
import { RoleBookEntry, Werewolf } from './Role'
import { Player } from './Player'
import { dc } from './Manager'
import { MIN_PLAYER_COUNT } from "./constants"
export enum Phase {
    Day,
    Afternoon,
    Night // votig phase for wolves
}
export class Game {
    turn: number = 0;
    phase: Phase = Phase.Afternoon;
    players: Player[];
    isDone: boolean = false;
    constructor(public chatId: number, private completeCallback: (game: Game) => void) {
        const chatMembers = dc.getChatContacts(chatId);
        // check if enough players are here
        if (chatMembers.length < MIN_PLAYER_COUNT) {
            throw new Error(`Not enough Players (min. ${MIN_PLAYER_COUNT})`);
        }
        const players: Player[] = [];
        const PlayerRoles = Array(chatMembers.length).fill(RoleBookEntry.Villager);
        // THIS assign roles (this is just some deterministic sample code)
        PlayerRoles[1] = RoleBookEntry.Werewolf;
        PlayerRoles[3] = RoleBookEntry.Werewolf;
        for (let index = 0; index < chatMembers.length; index++) {
            const chatMember = chatMembers[index];
            const PlayerRole = PlayerRoles[index];
            players.push(new Player(this, chatMember, PlayerRole));
        }
    }
    sendGroupMessage(msg: string | Message) {
        dc.sendMessage(this.chatId, msg);
    }
    onDM(player: Player, msg: Message) {
        if (this.turn === 0 || this.isDone) {
            // don't accept anything at first turn or when game is over
            return;
        }
        else if (player.alive) {
            player.processDM(this.phase, msg.getText());
        }
    }
    onTurnStart() {
        if (this.turn === 0) {
            // First turn (no voting yet)
            let playerCount: number = this.players.length;
            let wolveCount: number = this.players.filter((player) => player.role instanceof Werewolf).length;
            const startMessage = `Hallo, ich werde mit euch in die finstere Welt der grausamen Werwölfe eintauchen.
Zu dieser Stunde befinden sich ${wolveCount} Werwölfe unter euch, 
die die ${playerCount} Bürger töten wollen.
Jeden Moment erfahrt ihr, wer ihr seid!`;
            dc.sendMessage(this.chatId, startMessage);
            this.players.forEach((player) => {
                player.sendDMessage(player.role.firstTurnMessage);
            });
            // TODO WERWOLFGRUPPE anlegen? // in zukunft wird das nacht voting dort stattfinden
        }
        else {
            if (this.phase === Phase.Day) {
                dc.sendMessage(this.chatId, "Die dorfbewohner stimmen ab wen sie fuer einen Werwolf halten und hinrichten");
            }
            else if (this.phase === Phase.Afternoon) {
                dc.sendMessage(this.chatId, "Platzhalter fuer action runde");
            }
            else if (this.phase === Phase.Night) {
                dc.sendMessage(this.chatId, "Die Dorfbewohner schlafen");
            }
            // tell the players what to do in DM chat
            this.players.forEach((player) => player.sendRoleMessage(this.phase));
        }
        // Wait and End Turn
        this.countdown();
    }
    async countdown() {
        this.sendGroupMessage("Naechster zug in 1 min");
        await delay(30);
        this.sendGroupMessage("30 Sekunden verbleibend");
        await delay(20);
        this.sendGroupMessage("10 Sekunden verbleibend");
        await delay(10);
        this.onTurnEnd();
    }
    onTurnEnd() {
        if (this.phase === Phase.Day) {
            // abstimmung auswerten
        }
        else if (this.phase === Phase.Afternoon) {
            // anounce what special actions were taken and have something to announce
            // (like armors love arrow)
        }
        else if (this.phase === Phase.Night) {
            // wolf abstimmung auswerten
        }
        this.nextTurn();
    }
    nextTurn() {
        let alivePlayers = this.players.filter((player) => player.alive);
        let playerCount: number = alivePlayers.length;
        let wolveCount: number = alivePlayers.filter((player) => player.role instanceof Werewolf).length;
        let villagerCount = playerCount - wolveCount;
        if (wolveCount > 0 && villagerCount == 0) {
            // wolves have won
            this.isDone = true;
            this.sendGroupMessage("die werwölfe haben gewonnen");
            this.completeCallback(this);
        }
        else if (villagerCount > 0 && wolveCount == 0) {
            this.isDone = true;
            this.sendGroupMessage("die bürger haben gewonnen.\nihr habt euer dorf gerettet!");
            this.completeCallback(this);
        }
        else if (alivePlayers.length == 0) {
            this.isDone = true;
            this.sendGroupMessage("Alle sind tot, wie konnte das passieren?");
            this.completeCallback(this);
        }
        this.turn = this.turn + 1;
        // Advance day phase
        switch (this.phase) {
            case Phase.Day:
                this.phase = Phase.Afternoon;
                break;
            case Phase.Afternoon:
                this.phase = Phase.Night;
                break;
            case Phase.Night:
                this.phase = Phase.Day;
                break;
        }
        this.onTurnStart();
    }
}

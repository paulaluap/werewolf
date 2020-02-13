import { DeltaChat, Message, C } from 'deltachat-node'
import { Game } from './Game'
import { Player } from './Player'

export let dc: DeltaChat

export const setDC = (deltachat: DeltaChat) => dc = deltachat


export class Manager {
    games: Game[] = []

    constructor() { }

    findPlayer(contactId: number): Player {
        for (let i = 0; i < this.games.length; i++) {
            const game = this.games[i];
            for (let j = 0; j < game.players.length; j++) {
                const player = game.players[j];
                if (player.contactId == contactId) {
                    return player
                }
            }
        }
        return undefined
    }

    maybeReplyDM(chatId: number, msg: Message) {
        // would be easier if we had an api to get the author of the message directly on node
        const contactId = dc.getChatContacts(chatId).find((contactId) => contactId !== C.DC_CONTACT_ID_SELF)

        // Check if player is in game
        console.log("maybeReplyDM:", { chatId, contactId, msg: msg.getText() })

        // If true map Contact to Player and call Game.onDM
        const player = this.findPlayer(contactId) 
        if(player) {
            if(player.alive){
                player.game.onDM(player, msg)
            } else {
                // player is dead, parse no dm
                player.sendDMessage("You are dead, but still in a game");
                return;
            }
        } else {
            dc.sendMessage(chatId, "You are not in a game currently, type `@wolf start` in an group to start")
        }
    }

    maybeReplyGroup(chatId: number, msg: Message) {
        console.log("maybeReplyGroup", {chatId, msg:msg.getText()})
        // Check if this group has a running game
        const game = this.games.find((game) => game.chatId === chatId)
        if (!game) {
            // If not ask to start a new one / check if the command was to create a new one
            if (msg.getText() === "@wolf start") {
                // start new game
                const chatid = msg.getChatId()
                try {
                    // check if some chatmember are already in another game
                    if (false /* chat members inGame? */){
                        throw new Error("Error: some Chat Members are already in another running game")
                    }
                    // try to start the game
                    const game = new Game(chatid, this.removeGame)
                    this.games.push(game)
                    game.onTurnStart()
                } catch (error) {
                    dc.sendMessage(chatid, "Could not start game:" + error.message)
                }
            }
        }
    }

    removeGame(game: Game) {
        // remove the game from the array when it ended
        this.games = this.games.filter((game) => game !== game)
    }
}

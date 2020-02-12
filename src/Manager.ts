import { DeltaChat, Message } from 'deltachat-node'
import { Game } from './Game'

export let dc: DeltaChat

export const setDC = (deltachat: DeltaChat) => dc = deltachat


export class Manager {
    games: Game[] = []

    constructor() { }

    maybeReplyDM(chatId: number, msg: Message) {
        // Check if player is in game

        // If true map Contact to Player and call Game.onDM
    }

    maybeReplyGroup(chatId: number, msg: Message) {
        // Check if this group has a running game
        const game = this.games.find((game) => game.chatId === chatId)
        if (!game) {
            // If not ask to start a new one / check if the command was to create a new one
            if (true /* todo check command */) {
                // start new game
                const chatid = msg.getChatId()
                try {
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

        //TODO
    }
}

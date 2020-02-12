import { DeltaChat, C } from 'deltachat-node'
import path from 'path'
import {setDC, Manager} from './Manager'

// Load config
var conf = require('rc')("werewolf-dc", {
    email_address: undefined,
    email_password: undefined,
})

if (!conf.email_address || !conf.email_password) {
    console.error("Email address or password is missing.")
    process.exit(1)
}

// Start DC
const dc = new DeltaChat()
setDC(dc)

const gameManager = new Manager()

function handleDCMessage (chatid:number, msgId:number) {
    const chat = dc.getChat(chatid)
    const msg = dc.getMessage(msgId)

    const type = chat.getType()

    // seperate message from group and from single chat
    if(type === C.DC_CHAT_TYPE_SINGLE){
        gameManager.maybeReplyDM(chatid, msg)
    } else if(type === C.DC_CHAT_TYPE_GROUP || type === C.DC_CHAT_TYPE_VERIFIED_GROUP) {
        gameManager.maybeReplyGroup(chatid, msg)
    }
    console.log("> ", chatid, msg.getText())
}

dc.on('DC_EVENT_MSGS_CHANGED', (chatId, msgId) => {
    // Deaddrop fix for bot, otherwise first message would be ignored
    const message = dc.getMessage(msgId)
    if (message && message.isDeadDrop()) {
        handleDCMessage(dc.createChatByMessageId(msgId), msgId)
    }
})
dc.on('DC_EVENT_INCOMING_MSG', (chatid: any, msgId: any) => handleDCMessage(chatid, msgId))

// dc.on('ALL', console.log.bind(null, 'core |'))// for debugging

dc.open(path.join(__dirname, '../data'), () => {
    if (!dc.isConfigured()) {
        dc.configure({
            addr: conf.email_address,
            mail_pw: conf.email_password,
            e2ee_enabled: true,
        }, () => {
            console.log('init done')
        })
    } else {
        console.log('init done')
    }
})

process.on('exit', () => {
    dc.close(() => {
        // clean up
    })
})


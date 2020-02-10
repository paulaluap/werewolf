const DeltaChat = require('deltachat-node')
const C = require('deltachat-node/constants')
const path = require('path')

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

function handleDCMessage (chatid, msgId) {

    // TODO seperate message from group and from single chat
    console.log({chatid, msgId})

    const chat = dc.getChat(chatid).toJson()
    const message = dc.getMessage(msgId).toJson()

    console.log("> ",chat, message)
}

dc.on('DC_EVENT_MSGS_CHANGED', (chatId, msgId) => {
    // Deaddrop fix for bot, otherwise first message would be ignored
    const message = dc.getMessage(msgId)
    if (message && message.isDeadDrop()) {
        handleDCMessage(dc.createChatByMessageId(msgId), msgId)
    }
})
dc.on('DC_EVENT_INCOMING_MSG', (...args) => handleDCMessage(...args))

// dc.on('ALL', console.log.bind(null, 'core |'))// for debugging

dc.open(path.join(__dirname, '../data'), () => {
    if (!dc.isConfigured()) {
        dc.configure({
            addr: conf.email_address,
            mail_pw: conf.email_password,
            e2ee_enabled: true,
        })
    }
    console.log(console.log('init done'))
})

process.on('exit', () => {
    dc.close(() => {
        close_db()
    })
})

// console.log('init done')

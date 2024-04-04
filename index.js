const TelegramApi = require('node-telegram-bot-api')
const {gameOptions, againOptions} = require('./options')
const token = '6492660850:AAEbQVRW58ddiK0ib3xPAzRtTW8YnQTWbME'

const bot = new TelegramApi(token, {polling: true} )

// базовые команды
bot.setMyCommands([
    {command: '/start', description: 'Начальное приветсвие'},
    {command: '/info', description: 'Информация о боте'},
    {command: '/game', description: 'Игра в угадывание число'},

])


const chats = {}




// старт игры при нажатии /game
const startGame =  async (chatId) =>{
    await bot.sendMessage(chatId, 'Я загадал цифру от 0 до 9, отгадай!')
    const randomNum = Math.floor(Math.random()*10)

    chats[chatId] = randomNum
    await bot.sendMessage(chatId, 'Отгадывай))',gameOptions)
}


// старт основной команды
const start = ()=>{
    //слушатель события на ввод пользователя
    bot.on('message', async (msg)=>{
        const text = msg.text
        const chatId = msg.chat.id
        if(text === '/start'){

        await bot.sendMessage(chatId,'https://tlgrm.eu/_/stickers/be1/98c/be198cd5-121f-4f41-9cc0-e246df7c210d/1.webp')
            return  bot.sendMessage(chatId, 'Добро пожаловать')
        }
        if(text==='/info'){
            return  bot.sendMessage(chatId, `Привет ${msg.from.first_name}`)
        }

        if(text === '/game'){
           return  startGame(chatId)
        }

        return bot.sendMessage(chatId, 'Моя твоя не понимать..', )

    })

    // нажатие на кнопку 
    bot.on('callback_query', async ( msg)=>{
        const data  = msg.data
        const chatId = msg.message.chat.id

        if (data==='/again'){
           return  startGame(chatId)
        }

        

        if (chats[chatId] == data){
           
           return  bot.sendMessage(chatId, 'Вы отгадали. Урааа', againOptions)
        }else{ 
            bot.sendMessage(chatId, `ты нажал цифру ${data}`)
            return   bot.sendMessage(chatId, `Неа, не верно, подсказка  ${chats[chatId]}`, againOptions)
        }
    })
}

start()
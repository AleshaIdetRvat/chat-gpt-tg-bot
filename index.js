require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const { Configuration, OpenAIApi } = require("openai");

// Setup openai
const configuration = new Configuration({
    apiKey: process.env.OPEN_AI_TOKEN,
});

const openai = new OpenAIApi(configuration);

// Init tg bot
const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });

bot.on("message", async (msg) => {
    const chatId = msg.chat.id;

    const prompt = msg.reply_to_message
        ? `${msg.reply_to_message.text}\n\n${msg.text}`
        : msg.text;

    // Use the OpenAI API to generate a response
    try {
        // console.log(prompt);

        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: prompt,
            temperature: 0.5,
            max_tokens: 1000,
            top_p: 1.0,
            frequency_penalty: 0.5,
            presence_penalty: 0.0,
            stop: ["You:"],
        });

        bot.sendMessage(chatId, response.data.choices[0].text);
    } catch (error) {
        console.error(error);
    }
});

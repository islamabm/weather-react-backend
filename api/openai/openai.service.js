const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId
require('dotenv').config()
module.exports = {
  ask,
}

const { Configuration, OpenAIApi } = require('openai')
async function ask(msg, character, temperature) {
  try {
    const configuration = new Configuration({
      apiKey: process.env.REACT_APP_CHAT_GPT_API_KEY,
    })

    const openai = new OpenAIApi(configuration)

    const messages = [
      {
        role: 'system',
        content: `You are a helpful assistant that gives advice based on the current temperature, which is ${temperature} degrees.`,
      },
      { role: 'user', content: msg },
    ]

    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: messages,
    })

    let reply = response.data.choices[0].message.content
    return reply
  } catch (error) {
    console.error(
      'Error in OpenAI service:',
      error.response ? error.response.data.error : error
    )
  }
}

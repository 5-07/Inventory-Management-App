'use server'

import { ChatOpenAI } from "@langchain/openai"

const chatModel = new ChatOpenAI({
    apiKey: process.env.OPENAI_API_KEY

})

export async function generateRecipes(prompt: string) {
    // Corrected prompt string with proper string interpolation
    const formattedPrompt = `Generate three recipes for a ${prompt} dish. The output should be in JSON array and each object should contain a recipe name field named 'name', description field named 'description', an array of ingredients named 'ingredients', and an array of step-by-step instructions named 'instructions'.`;
  
    // Await the response from chat model
    const response = await chatModel.invoke(formattedPrompt);
  
    // Parse and return the JSON content
    return JSON.parse(response.content as string);
  }
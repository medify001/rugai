import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: "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",
  dangerouslyAllowBrowser: true
});

export const generateCryptoAdvice = async (prompt) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a cryptocurrency expert advisor. Provide detailed analysis and insights about crypto tokens while maintaining a balanced and cautious perspective. Always include risk warnings and remind users about the volatile nature of cryptocurrency investments."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error generating crypto advice:', error);
    return "I apologize, but I'm unable to provide advice at the moment. Please try again later.";
  }
};
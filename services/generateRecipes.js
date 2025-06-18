
import Constants from 'expo-constants';

const OPENAI_API_KEY = Constants.expoConfig.extra.openaiApiKey;

export const generateRecipes = async (groceryList) => {
  const ingredientNames = groceryList.map(item => item.name).join(', ');

  const prompt = `
You are a professional recipe developer. Based only on the following ingredients: ${ingredientNames},
create 2 realistic, appealing meals that real people would actually want to eat.

DO NOT use ingredients that are not listed. DO NOT guess weird substitutes. DO NOT generate unusual or unrealistic combinations.
MAKE SURE that the instructions only use ingredients listed in the ingredients list. 

Each recipe should:
- Have a clear, appetizing name
- List only ingredients provided
- Include short, simple cooking instructions (assume basic kitchen tools)
- Be something a person could prepare with common sense

Return the result as clean JSON in this exact format:

[
  {
    "name": "Meal Name",
    "ingredients": ["ingredient 1", "ingredient 2", "..."],
    "instructions": ["Step 1...", "Step 2...", "..."]
  }
]
`;

  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a helpful cooking assistant.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 800,
      }),
    });

    const data = await res.json();
    const text = data.choices?.[0]?.message?.content?.trim();
    const jsonStart = text.indexOf('[');
    const jsonEnd = text.lastIndexOf(']') + 1;

    const cleanJson = text.slice(jsonStart, jsonEnd);
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error('OpenAI fetch error:', error);
    return [];
  }
};

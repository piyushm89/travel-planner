import OpenAI from 'openai';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateItineraryJSON({ destination, budget, startDate, endDate, interests, currency }) {
  // Check if using dummy API key
  if (process.env.OPENAI_API_KEY === 'sk-test-dummy-openai-key-for-development-testing') {
    console.log('🧪 Using mock OpenAI response for testing...');
    
    // Return mock itinerary data
    const mockItinerary = {
      itinerary: [
        {
          date: startDate,
          activities: [
            {
              time: "09:00",
              title: `Welcome to ${destination}`,
              description: `Start your ${budget} budget adventure in ${destination}`,
              category: "sightseeing",
              suggestedArea: "City Center"
            },
            {
              time: "14:00",
              title: "Local Cuisine Experience",
              description: `Try authentic local food that matches your interests: ${interests.join(', ')}`,
              category: "food",
              suggestedArea: "Restaurant District"
            },
            {
              time: "19:00",
              title: "Evening Exploration",
              description: `Explore the nightlife and culture of ${destination}`,
              category: "nightlife",
              suggestedArea: "Entertainment District"
            }
          ]
        }
      ],
      notes: `Mock itinerary generated for ${destination}. Budget: ${budget}, Currency: ${currency || 'INR'}`
    };
    
    return mockItinerary;
  }

  const prompt = `
You are a travel planner. Generate a day-by-day itinerary in strict JSON for:

destination: ${destination}

dates: ${startDate} to ${endDate}

budget: ${budget}

interests: ${interests.join(', ')}

currency: ${currency || 'INR'}

JSON schema:
{
  "itinerary": [
    {
      "date": "YYYY-MM-DD",
      "activities": [
        {
          "time": "HH:MM",
          "title": "string",
          "description": "string",
          "category": "sightseeing|food|museum|outdoors|nightlife|shopping|cafe|other",
          "suggestedArea": "string neighborhood/area"
        }
      ]
    }
  ],
  "notes": "string with brief tips"
}
Respond ONLY with JSON, no extra text.
`;

  const resp = await client.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7
  });

  const text = resp.choices[0].message.content;
  const json = JSON.parse(text);
  return json;
}

import { generateText } from '@fastshot/ai';
import { ADHDHurdle, FocusPlan, WorkoutTask, MealTask } from '@/types';

/**
 * Generate a personalized FocusPlan based on user's ADHD hurdles
 */
export async function generateFocusPlan(hurdles: ADHDHurdle[]): Promise<FocusPlan> {
  const hurdleDescriptions = hurdles.map((h) => h.replace(/_/g, ' ')).join(', ');

  const prompt = `You are an ADHD-focused fitness and meal planning expert. Create a simple, low-friction 1-week plan for someone with these challenges: ${hurdleDescriptions}.

Requirements:
- 3 short workouts per week (5-15 minutes each)
- 3 simple meal prep recipes (5-10 minutes prep time)
- Each task should have a simplified version for overwhelm
- Focus on building sustainable habits, not perfection

Format your response as JSON with this structure:
{
  "workouts": [
    {
      "title": "5-Minute Morning Stretch",
      "duration": 5,
      "type": "flexibility",
      "description": "Gentle stretches to wake up your body",
      "simplifiedVersion": {
        "title": "2-Minute Quick Stretch",
        "duration": 2,
        "description": "Just stretch your arms overhead and touch your toes"
      }
    }
  ],
  "meals": [
    {
      "title": "Quick Protein Bowl",
      "prepTime": 5,
      "servings": 2,
      "difficulty": "easy",
      "description": "Simple protein-rich meal"
    }
  ]
}`;

  try {
    const response = await generateText({ prompt });

    // Parse the AI response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse AI response');
    }

    const aiData = JSON.parse(jsonMatch[0]);

    // Convert to FocusPlan format
    const plan: FocusPlan = {
      id: Date.now().toString(),
      userId: 'current-user',
      weekNumber: 1,
      workouts: aiData.workouts.map((w: any, index: number) => ({
        id: `workout-${index}`,
        title: w.title,
        duration: w.duration,
        type: w.type,
        description: w.description || '',
        isCompleted: false,
        simplifiedVersion: w.simplifiedVersion,
      })),
      meals: aiData.meals.map((m: any, index: number) => ({
        id: `meal-${index}`,
        title: m.title,
        prepTime: m.prepTime,
        servings: m.servings,
        difficulty: m.difficulty,
        isCompleted: false,
        steps: [],
        ingredients: [],
      })),
      createdAt: new Date().toISOString(),
      generatedByAI: true,
    };

    return plan;
  } catch (error) {
    console.error('Error generating FocusPlan:', error);
    // Return a default plan if AI fails
    return getDefaultPlan();
  }
}

/**
 * Generate AI Body Double chat response
 */
export async function generateBodyDoubleResponse(
  userMessage: string,
  context?: string
): Promise<string> {
  const prompt = `You are a supportive AI Body Double helping someone with ADHD complete their fitness and meal prep tasks. ${context ? `Context: ${context}` : ''}

User says: "${userMessage}"

Respond in a warm, encouraging, and non-judgmental way. Keep responses short (1-2 sentences). Focus on:
- Breaking tasks into tiny steps
- Celebrating small wins
- Reducing overwhelm
- Being a supportive presence

Response:`;

  try {
    const response = await generateText({ prompt });
    return response.trim();
  } catch (error) {
    console.error('Error generating body double response:', error);
    return "I'm here with you! Let's take this one small step at a time. 💪";
  }
}

/**
 * Fallback default plan
 */
function getDefaultPlan(): FocusPlan {
  return {
    id: Date.now().toString(),
    userId: 'current-user',
    weekNumber: 1,
    workouts: [
      {
        id: 'workout-1',
        title: '5-Minute Morning Stretch',
        duration: 5,
        type: 'flexibility',
        description: 'Gentle stretches to start your day',
        isCompleted: false,
        simplifiedVersion: {
          title: '2-Minute Quick Stretch',
          duration: 2,
          description: 'Just stretch your arms overhead',
        },
      },
      {
        id: 'workout-2',
        title: '10-Minute Walk',
        duration: 10,
        type: 'cardio',
        description: 'Easy neighborhood walk',
        isCompleted: false,
        simplifiedVersion: {
          title: '5-Minute Walk',
          duration: 5,
          description: 'Walk around your block',
        },
      },
      {
        id: 'workout-3',
        title: '7-Minute Bodyweight Circuit',
        duration: 7,
        type: 'strength',
        description: 'Simple exercises at home',
        isCompleted: false,
        simplifiedVersion: {
          title: '3-Minute Movement',
          duration: 3,
          description: 'Just do 10 squats',
        },
      },
    ],
    meals: [
      {
        id: 'meal-1',
        title: 'Quick Chicken & Veggie Stir-Fry',
        prepTime: 5,
        servings: 2,
        difficulty: 'easy',
        isCompleted: false,
        steps: [],
        ingredients: [],
      },
      {
        id: 'meal-2',
        title: 'Protein Smoothie Bowl',
        prepTime: 3,
        servings: 1,
        difficulty: 'easy',
        isCompleted: false,
        steps: [],
        ingredients: [],
      },
      {
        id: 'meal-3',
        title: 'Simple Avocado Toast',
        prepTime: 5,
        servings: 1,
        difficulty: 'easy',
        isCompleted: false,
        steps: [],
        ingredients: [],
      },
    ],
    createdAt: new Date().toISOString(),
    generatedByAI: false,
  };
}

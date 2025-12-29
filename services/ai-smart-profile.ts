import { generateText } from '@fastshot/ai';
import { getDopamineWins, getUserProfile } from '@/services/firestore';

/**
 * Smart Profile Generation - AI analyzes user's workout history and suggests optimal times
 */
export async function generateSmartWorkoutSuggestions(userId: string): Promise<{
  optimalTimes: string[];
  preferredWorkoutTypes: string[];
  insights: string;
}> {
  try {
    // Fetch user data from Firestore
    const [profile, wins] = await Promise.all([
      getUserProfile(userId),
      getDopamineWins(userId),
    ]);

    if (!profile) {
      throw new Error('User profile not found');
    }

    // Analyze workout patterns
    const workoutWins = wins.filter((w) => w.type === 'workout');
    const completionTimes = workoutWins.map((w) => {
      const date = new Date(w.timestamp);
      return date.getHours();
    });

    const workoutTypes = workoutWins.map((w) => w.title);

    const prompt = `You are an AI fitness analyst. Analyze this user's workout history and provide smart insights.

User's ADHD Hurdles: ${profile.adhdHurdles.map((h) => h.replace(/_/g, ' ')).join(', ')}
Total Workouts Completed: ${workoutWins.length}
Completion Times (hours): ${completionTimes.join(', ')}
Workout Types Completed: ${workoutTypes.join(', ')}

Based on this data, suggest:
1. The 2-3 optimal times of day for this user to exercise (considering their ADHD hurdles)
2. Their preferred workout types
3. Personalized insights about their workout patterns

Format as JSON:
{
  "optimalTimes": ["7:00 AM", "5:30 PM"],
  "preferredWorkoutTypes": ["short cardio", "bodyweight exercises"],
  "insights": "You tend to complete workouts in the morning. Consider scheduling your most important workout then."
}`;

    const response = await generateText({ prompt });

    // Parse AI response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse AI response');
    }

    const aiData = JSON.parse(jsonMatch[0]);

    return {
      optimalTimes: aiData.optimalTimes || ['Morning', 'Evening'],
      preferredWorkoutTypes: aiData.preferredWorkoutTypes || ['Quick exercises'],
      insights:
        aiData.insights ||
        'Keep building your workout habit! Consistency matters more than perfection.',
    };
  } catch (error) {
    console.error('Error generating smart profile:', error);

    // Return sensible defaults
    return {
      optimalTimes: ['Morning (7-9 AM)', 'Evening (5-7 PM)'],
      preferredWorkoutTypes: ['Short workouts', 'Low-pressure exercises'],
      insights:
        'Start with short, manageable workouts. The best time to exercise is whenever you can show up!',
    };
  }
}

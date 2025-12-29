// FocusFit Type Definitions

export type ADHDHurdle =
  | 'forgetting_to_eat'
  | 'starting_is_hard'
  | 'staying_focused'
  | 'decision_paralysis'
  | 'time_blindness';

export interface OnboardingQuizAnswer {
  hurdle: ADHDHurdle;
  label: string;
  icon: string;
}

export interface FocusPlan {
  id: string;
  userId: string;
  weekNumber: number;
  workouts: WorkoutTask[];
  meals: MealTask[];
  createdAt: string;
  generatedByAI: boolean;
}

export interface WorkoutTask {
  id: string;
  title: string;
  duration: number; // in minutes
  type: 'cardio' | 'strength' | 'flexibility' | 'mindfulness';
  description: string;
  isCompleted: boolean;
  scheduledFor?: string;
  simplifiedVersion?: {
    title: string;
    duration: number;
    description: string;
  };
}

export interface MealTask {
  id: string;
  title: string;
  prepTime: number; // in minutes
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  imageUrl?: string;
  steps: RecipeStep[];
  ingredients: Ingredient[];
  isCompleted: boolean;
  scheduledFor?: string;
}

export interface RecipeStep {
  id: string;
  stepNumber: number;
  instruction: string;
  imageUrl?: string;
  estimatedTime: number; // in minutes
}

export interface Ingredient {
  id: string;
  name: string;
  quantity: string;
  unit: string;
  aisle: string; // for smart grocery list
}

export interface CurrentAction {
  id: string;
  type: 'workout' | 'meal' | 'break';
  title: string;
  duration: number;
  startedAt?: string;
  timeRemaining?: number;
  data: WorkoutTask | MealTask;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface DopamineWin {
  id: string;
  userId: string;
  type: 'workout' | 'meal' | 'focus' | 'milestone';
  title: string;
  description: string;
  timestamp: string;
  imageUrl?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  adhdHurdles: ADHDHurdle[];
  currentPlanId?: string;
  dopamineWins: DopamineWin[];
  preferences: {
    enableHaptics: boolean;
    enableConfetti: boolean;
    enableVoiceLogging: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface GroceryList {
  id: string;
  userId: string;
  items: GroceryItem[];
  weekOf: string;
  isCompleted: boolean;
}

export interface GroceryItem {
  id: string;
  ingredientId: string;
  name: string;
  quantity: string;
  unit: string;
  aisle: string;
  isPurchased: boolean;
}

export interface VoiceLog {
  id: string;
  userId: string;
  audioUrl?: string;
  transcription: string;
  category: 'meal' | 'focus' | 'mood' | 'other';
  timestamp: string;
  processedByAI: boolean;
}

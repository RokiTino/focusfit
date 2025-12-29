import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
  deleteDoc,
  getDocs,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
  UserProfile,
  FocusPlan,
  DopamineWin,
  ADHDHurdle,
  DietaryRestriction,
  MealTask,
  WorkoutTask,
} from '@/types';

// User Profile Operations
export async function createUserProfile(
  userId: string,
  email: string,
  adhdHurdles: ADHDHurdle[],
  dietaryRestrictions: DietaryRestriction[]
): Promise<void> {
  const userProfile: Omit<UserProfile, 'id'> = {
    email,
    adhdHurdles,
    dietaryRestrictions,
    dopamineWins: [],
    preferences: {
      enableHaptics: true,
      enableConfetti: true,
      enableVoiceLogging: true,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await setDoc(doc(db, 'users', userId), userProfile);
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const userDoc = await getDoc(doc(db, 'users', userId));

  if (!userDoc.exists()) {
    return null;
  }

  return {
    id: userDoc.id,
    ...userDoc.data(),
  } as UserProfile;
}

export async function updateUserProfile(
  userId: string,
  updates: Partial<UserProfile>
): Promise<void> {
  await updateDoc(doc(db, 'users', userId), {
    ...updates,
    updatedAt: new Date().toISOString(),
  });
}

// Focus Plan Operations
export async function saveFocusPlan(userId: string, plan: FocusPlan): Promise<string> {
  const planData = {
    ...plan,
    userId,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };

  const planRef = await addDoc(collection(db, 'focus_plans'), planData);

  // Update user's current plan reference
  await updateDoc(doc(db, 'users', userId), {
    currentPlanId: planRef.id,
    updatedAt: new Date().toISOString(),
  });

  return planRef.id;
}

export async function getCurrentPlan(userId: string): Promise<FocusPlan | null> {
  const userProfile = await getUserProfile(userId);

  if (!userProfile || !userProfile.currentPlanId) {
    return null;
  }

  const planDoc = await getDoc(doc(db, 'focus_plans', userProfile.currentPlanId));

  if (!planDoc.exists()) {
    return null;
  }

  return planDoc.data() as FocusPlan;
}

export function subscribeToCurrentPlan(
  userId: string,
  callback: (plan: FocusPlan | null) => void
): () => void {
  // First get the user's current plan ID
  getUserProfile(userId).then((profile) => {
    if (!profile || !profile.currentPlanId) {
      callback(null);
      return;
    }

    // Subscribe to real-time updates for the current plan
    const unsubscribe = onSnapshot(
      doc(db, 'focus_plans', profile.currentPlanId),
      (snapshot) => {
        if (snapshot.exists()) {
          callback(snapshot.data() as FocusPlan);
        } else {
          callback(null);
        }
      }
    );

    return unsubscribe;
  });

  // Return empty unsubscribe for now (this is a simplified implementation)
  return () => {};
}

// Task Operations
export async function updateTaskStatus(
  userId: string,
  planId: string,
  taskId: string,
  isCompleted: boolean,
  taskType: 'workouts' | 'meals'
): Promise<void> {
  const planRef = doc(db, 'focus_plans', planId);
  const planDoc = await getDoc(planRef);

  if (!planDoc.exists()) {
    throw new Error('Plan not found');
  }

  const planData = planDoc.data() as FocusPlan;
  const tasks = planData[taskType];

  const updatedTasks = tasks.map((task) =>
    task.id === taskId ? { ...task, isCompleted } : task
  );

  await updateDoc(planRef, {
    [taskType]: updatedTasks,
    updatedAt: Timestamp.now(),
  });

  // If task is completed, add a dopamine win
  if (isCompleted) {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      await addDopamineWin(userId, {
        id: `${Date.now()}`,
        userId,
        title: task.title,
        description: `Completed ${taskType === 'workouts' ? 'workout' : 'meal prep'}: ${task.title}`,
        timestamp: new Date().toISOString(),
        type: taskType === 'workouts' ? 'workout' : 'meal',
      });
    }
  }
}

// Dopamine Win Operations
export async function addDopamineWin(userId: string, win: DopamineWin): Promise<void> {
  await addDoc(collection(db, 'users', userId, 'dopamine_wins'), {
    ...win,
    createdAt: Timestamp.now(),
  });
}

export async function getDopamineWins(userId: string): Promise<DopamineWin[]> {
  const winsQuery = query(
    collection(db, 'users', userId, 'dopamine_wins'),
    orderBy('completedAt', 'desc')
  );

  const snapshot = await getDocs(winsQuery);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as DopamineWin[];
}

export function subscribeToDopamineWins(
  userId: string,
  callback: (wins: DopamineWin[]) => void
): () => void {
  const winsQuery = query(
    collection(db, 'users', userId, 'dopamine_wins'),
    orderBy('completedAt', 'desc')
  );

  const unsubscribe = onSnapshot(winsQuery, (snapshot) => {
    const wins = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as DopamineWin[];

    callback(wins);
  });

  return unsubscribe;
}

// AI Context Retrieval for Body Double
export async function getUserContextForAI(userId: string): Promise<{
  name: string;
  adhdHurdles: ADHDHurdle[];
  dietaryRestrictions: DietaryRestriction[];
  recentWins: number;
}> {
  const profile = await getUserProfile(userId);
  const wins = await getDopamineWins(userId);

  return {
    name: profile?.email?.split('@')[0] || 'there',
    adhdHurdles: profile?.adhdHurdles || [],
    dietaryRestrictions: profile?.dietaryRestrictions || [],
    recentWins: wins.filter(
      (w) =>
        new Date(w.timestamp) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ).length,
  };
}

// Link anonymous account data to permanent account
export async function linkAnonymousData(
  anonymousUserId: string,
  permanentUserId: string
): Promise<void> {
  // Get anonymous user's data
  const anonymousProfile = await getUserProfile(anonymousUserId);
  const anonymousWins = await getDopamineWins(anonymousUserId);

  if (anonymousProfile) {
    // Transfer profile data
    await updateUserProfile(permanentUserId, {
      adhdHurdles: anonymousProfile.adhdHurdles,
      dietaryRestrictions: anonymousProfile.dietaryRestrictions,
      currentPlanId: anonymousProfile.currentPlanId,
      preferences: anonymousProfile.preferences,
    });

    // Transfer dopamine wins
    for (const win of anonymousWins) {
      await addDopamineWin(permanentUserId, win);
    }

    // Delete anonymous user data (optional)
    await deleteDoc(doc(db, 'users', anonymousUserId));
  }
}

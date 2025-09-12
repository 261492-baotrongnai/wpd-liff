export interface AchievementPageInfo {
    totalPoints: number;
    streakDays: number;
    maliProgress: number;
    streakMedalAchievement: Achievement[];
}
export interface Achievement {
      id: number;
      title: string;
      description: string | null;
      points: number;
      streakThreshold: number;
}

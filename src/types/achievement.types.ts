export interface AchievementPageInfo {
  currentFrame: StoreItem | null
  totalPoints: number
  streakDays: number
  maliProgress: number
  coinProgress: number
  streakMedalAchievement: Achievement[]
}
export interface Achievement {
  id: number
  title: string
  description: string | null
  points: number
  streakThreshold: number
}

export interface StoreItem {
  owned: boolean
  id: number
  name: string
  description: string
  imageName: string
  category: string
  pointsRequired: number
}

export interface StoreInfo {
  userPoints: number | null
  storeItems: StoreItem[]
}

export interface UserFrameInfo {
  currentFrame: StoreItem | null | undefined
  frames: {
    id: number
    name: string
    imageName: string
    isSelected: boolean
  }[]
}

export interface Frame {
  id: number
  name: string
  imageName: string
  isSelected: boolean
  scale: number
  dx: number
  dy: number
}

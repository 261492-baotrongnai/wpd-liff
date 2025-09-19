import {
  type AchievementPageInfo,
  type StoreInfo,
  type UserFrameInfo,
} from '@/types/achievement.types'
import { apiService } from './api.service'

export async function getAchievementsPageInfo() {
  const response = await apiService.get<AchievementPageInfo>('/achievements/page-info')
  // console.log('Achievements page info:', response)
  return response
}

export async function getAllStoreItems() {
  const response = await apiService.get<StoreInfo>('/store-items')
  // console.log('All store items:', response)
  return response
}

export async function redeemStoreItem(itemId: number) {
  const response = await apiService.post<StoreInfo>(`/store-items/buy-item`, { itemId: itemId })
  // console.log('Redeem store item:', response)
  return response
}

export async function getUserFrameInfo(scale: number, dx: number, dy: number) {
  const response = await apiService.get<UserFrameInfo>('/store-items/user-frames')
  console.log('User frame info:', response)
  const currentFrame = response.currentFrame
  const frames = response.frames.map((f) => ({
    ...f,
    scale: scale,
    dx: dx,
    dy: dy,
  }))
  return { currentFrame, frames }
}

export async function setUserFrame(frameId: number) {
  const response = await apiService.put<UserFrameInfo>('/users/update-current-frame', {
    frameId: frameId,
  })
  // console.log('Set user frame:', response)
  const currentFrame = response.currentFrame
  const frames = response.frames.map((f) => ({
    ...f,
    scale: 1.6,
    dx: 0,
    dy: 0,
  }))
  return { currentFrame, frames }
}

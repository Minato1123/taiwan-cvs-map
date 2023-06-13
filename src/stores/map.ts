import { defineStore } from 'pinia'
import type { MartDataType, PointType, BoundType } from '../types/index'
import data from '../assets/json/data.json'

export const useMapStore = defineStore('map', () => {
  const allMartList: MartDataType[] = data
  const mapCenterPoint = ref<PointType>({
    lat: allMartList[0].lat,
    lng: allMartList[0].lng
  })
  const makerPointList = ref<PointType[]>([])

  const mapBounds = ref<BoundType | null>(null)

  function setCenterPoint(lat: number, lng: number) {
    mapCenterPoint.value.lat = lat
    mapCenterPoint.value.lng = lng
  }

  const martListInMap = computed(() => {
    const bounds = mapBounds.value
    if (bounds == null)
      return []

    return allMartList.filter((mart) => {
      if (mart.lat > bounds.north)
        return false
      else if (mart.lat < bounds.south)
        return false
      else if (mart.lng > bounds.east)
        return false
      else if (mart.lng < bounds.west)
        return false

      return true
    })
  })

  function updateMapBounds(bounds: BoundType) {
    mapBounds.value = bounds
  }

  return { 
    mapCenterPoint,
    mapBounds,
    makerPointList,
    martListInMap,
    setCenterPoint,
    updateMapBounds
  }
})

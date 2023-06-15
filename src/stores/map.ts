import { defineStore } from 'pinia'
import type { MartDataType, PointType, BoundType, ServiceType } from '../types/index'
import data from '../assets/json/data.json'
import type { MaybeRef } from 'vue'


export const useMapStore = defineStore('map', () => {
  const allMartList: MartDataType[] = data as MartDataType[]
  const currentMart = ref<MartDataType>(allMartList[0])
  const mapCenterPoint = ref<PointType>({
    lat: currentMart.value.lat,
    lng: currentMart.value.lng
  })
  const makerPointList = ref<PointType[]>([])

  function updateCurrentMart(mart: MartDataType) {
    currentMart.value = mart
  }

  function updateCenterPoint(lat: number, lng: number) {
    mapCenterPoint.value.lat = lat
    mapCenterPoint.value.lng = lng
  }

  const mapBounds = ref<BoundType | null>(null)
  const selectedServiceList = ref<ServiceType[]>([])

  const mapZoom = ref(16)

  function updateMapZoom(zoom: number) {
    mapZoom.value = zoom
  }

  const showMartZoomLimit = 14

  function getMartListInMap() {
    const bounds = mapBounds.value
    if (bounds == null || mapZoom.value < showMartZoomLimit)
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

      if (selectedServiceList.value.length <= 0) return true

      return selectedServiceList.value.every((service) => {
        return mart.service.includes(service)
      })
    })
  }

  function updateSelectedServiceList(selectedList: ServiceType[]) {
    selectedServiceList.value = selectedList
  }

  const sortedMartList = ref<MartDataType[]>([])

  function updateSortedMartList(martList: MartDataType[]) {
    sortedMartList.value = martList
  }

  function updateMapBounds(bounds: BoundType) {
    mapBounds.value = bounds
  }

  function searchByAddress(address: MaybeRef<string>) {
    console.log(unref(address))
  }

  function searchByMartName(name: MaybeRef<string>) {
    const theMart = allMartList.find((mart) => mart.name.includes(unref(name)))
    console.log(theMart, name)
    if (theMart == null) return
    currentMart.value = theMart
    updateCenterPoint(theMart.lat, theMart.lng)
  }

  function searchByMartNumber(number: MaybeRef<string>) {
    const theMart = allMartList.find((mart) => mart.pkey.startsWith(unref(number)))
    if (theMart == null) return
    currentMart.value = theMart
    updateCenterPoint(theMart.lat, theMart.lng)
  }
  
  return { 
    mapCenterPoint,
    mapBounds,
    currentMart,
    makerPointList,
    sortedMartList,
    mapZoom,
    showMartZoomLimit,
    getMartListInMap,
    updateMapZoom,
    updateSelectedServiceList,
    updateCenterPoint,
    updateMapBounds,
    updateCurrentMart,
    updateSortedMartList,
    searchByAddress,
    searchByMartName,
    searchByMartNumber
  }
})

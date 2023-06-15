<script setup lang="ts">
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useMapStore } from '../stores/map'
import type { MartDataType, BoundType } from '../types/index'

const { getMartListInMap, updateCenterPoint, updateMapBounds, updateCurrentMart, updateSortedMartList, updateMapZoom, showMartZoomLimit } = useMapStore()
const { mapCenterPoint, currentMart, mapZoom } = storeToRefs(useMapStore())

const mapEl = ref<HTMLElement | null>(null)
const map = shallowRef<L.Map | null>(null)

function getMapBound(): BoundType | undefined {
  if (map.value == null) 
    return

  const bound = map.value.getBounds()
  return {
    east: bound.getEast(),
    north: bound.getNorth(),
    west: bound.getWest(),
    south: bound.getSouth()
  }
}

const iconSize = computed<number>(() => mapZoom.value * 1.5)
const theIconSize = computed<number>(() => mapZoom.value * 2.4)

const martMarkerList = ref<(L.Marker<any> | undefined)[]>([])
function setMarkers(martList: MartDataType[]) {
  if (martMarkerList.value != null) {
    martMarkerList.value.forEach((marker)=> {
      if (marker == null) return
      marker.remove()
    })
    martMarkerList.value = []
  }
  if (mapZoom.value < showMartZoomLimit) return []


  const familyMartIcon = L.icon({
    iconUrl: 'familymart-icon.svg',
    iconSize: [iconSize.value, iconSize.value],
  })

  const theMartIcon = L.icon({
    iconUrl: 'the-mart-icon.svg',
    iconSize: [theIconSize.value, theIconSize.value],
  })
  
  martMarkerList.value = martList.map((mart) => {
    if (map.value == null) return

    const isTheMart = currentMart && currentMart.value && currentMart.value.pkey === mart.pkey ? true : false

    return L.marker([mart.lat, mart.lng], {
      icon: isTheMart ? theMartIcon : familyMartIcon,
      alt: mart.name,
      title: mart.name,
      opacity: isTheMart ? 1 : 0.75
    }).addTo(map.value).on('click', () => {
      updateCenterPoint(mart.lat, mart.lng)
      updateCurrentMart(mart)
      updateMapZoom(17)
    })
  })
}

const sortedMartList = computed<MartDataType[]>(() => {
  const theMap = map.value
  if (theMap == null) return []

  const martListInMap = getMartListInMap()
  return martListInMap.sort((a, b) => {
    return theMap.distance([mapCenterPoint.value.lat, mapCenterPoint.value.lng], [a.lat, a.lng]) - theMap.distance([mapCenterPoint.value.lat, mapCenterPoint.value.lng], [b.lat, b.lng])
  })
})

watch(sortedMartList, () => {
  updateSortedMartList(sortedMartList.value)
})

onMounted(() => {
  if (mapEl.value == null)
    return

  map.value = L.map(mapEl.value, {
    center: mapCenterPoint.value,
    zoom: mapZoom.value,
    zoomControl: true
  })

  const bound = getMapBound()

  if (bound != null)
    updateMapBounds(bound)

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map.value)
  
  const martListInMap = getMartListInMap()
  setMarkers(martListInMap)

  // 註冊監聽地圖縮放
  map.value.on('zoom', () => {
    if (map.value == null) return

    updateMapZoom(map.value.getZoom())
    const bounds = getMapBound()
    if (bounds == null) return
    updateMapBounds(bounds)
    
  })

  map.value.on('zoomend', () => {
    const martListInMap = getMartListInMap()
    setMarkers(martListInMap)
  })

  // 註冊監聽地圖拖動
  map.value.on('move', () => {
    const bounds = getMapBound()
    if (bounds == null) return
    updateMapBounds(bounds)
    
  })

  map.value.on('moveend', () => {
    const martListInMap = getMartListInMap()
    setMarkers(martListInMap)
  })
})

watch(mapCenterPoint, () => {
  if (map.value == null)
    return

  map.value.flyTo(mapCenterPoint.value, mapZoom.value)

  const bounds = getMapBound()
  if (bounds == null)
    return

  updateMapBounds(bounds)
}, {
  deep: true
})




</script>

<template>
  <div class="map" ref="mapEl" />
</template>
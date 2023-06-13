<script setup lang="ts">
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useMapStore } from '../stores/map'
import type { BoundType } from '../types/index'

const { updateMapBounds } = useMapStore()
const { mapCenterPoint, martListInMap } = storeToRefs(useMapStore())

const mapEl = ref<HTMLElement | null>(null)
const map = shallowRef<L.Map | null>(null)

const mapBound = computed<BoundType | null>(() => {
  if (map.value == null) return null

  const bound = map.value.getBounds()
  return {
    east: bound.getEast(),
    north: bound.getNorth(),
    west: bound.getWest(),
    south: bound.getSouth()
  }
  
})

const mapZoom = ref<number>(16)
const iconSize = computed<number>(() => mapZoom.value * 1.65)
const familyMartIcon = L.icon({
  iconUrl: 'familymart-icon.svg',
  iconSize: [iconSize.value, iconSize.value],
})


onMounted(() => {
  if (mapEl.value == null)
    return

  map.value = L.map(mapEl.value, {
    center: mapCenterPoint.value,
    zoom: mapZoom.value,
    zoomControl: true
  })

  if (mapBound.value != null)
    updateMapBounds(mapBound.value)

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map.value)
  
  // TODO: 現在只有第一次會放 maker，後續更新 bounds 時需要重新放置
  const martMarkerList = martListInMap.value.map((mart) => {
    if (map.value == null) return

    return L.marker([mart.lat, mart.lng], {
      icon: familyMartIcon
    }).addTo(map.value)
  })
  console.log(martListInMap.value)

  // 註冊監聽地圖縮放
  map.value.on('zoom', () => {
    if (map.value == null) return

    mapZoom.value = map.value.getZoom()
    console.log(map.value.getZoom())
  })

})


watch(mapCenterPoint, () => {
  if (map.value == null)
    return

  map.value.flyTo(mapCenterPoint.value)

  if (mapBound.value == null)
    return

  updateMapBounds(mapBound.value)
}, {
  deep: true
})



</script>

<template>
  <div class="map" ref="mapEl" />
</template>
<script setup lang="ts">
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useMapStore } from '../stores/map'
import type { MartDataType, BoundType, PointType } from '../types/index'

const { getMartListInMap, updateMapBounds, updateCurrentMart, updateSortedMartList, updateMapZoom, showMartZoomLimit } = useMapStore()
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

function getPublicImgSrc(path: string) {
    return path.replace(/^\//, import.meta.env.BASE_URL)
  }

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
    iconUrl: getPublicImgSrc('familymart-icon.svg'),
    iconSize: [iconSize.value, iconSize.value],
  })

  const theMartIcon = L.icon({
    iconUrl: getPublicImgSrc('the-mart-icon.svg'),
    iconSize: [theIconSize.value, theIconSize.value],
  })
  
  martMarkerList.value = martList.map((mart) => {
    if (map.value == null) return

    const isTheMart = currentMart && currentMart.value && currentMart.value.pkey === mart.pkey ? true : false

    return L.marker([mart.lat, mart.lng], {
      icon: isTheMart ? theMartIcon : familyMartIcon,
      alt: mart.name,
      title: mart.name,
    }).addTo(map.value).on('click', () => {

      router.push({
        ...route,
        params: {
          latlng: turnLatLngToParam({lat: mart.lat, lng: mart.lng})
        }
      })
      
      updateCurrentMart(mart)
      updateMapZoom(17)
    })
  })
}

const router = useRouter()
const route = useRoute()

const centerPoint = ref<PointType | null>(null)

watch(() => route.params.latlng, () => {
  if (route.params.latlng === '') {
      centerPoint.value = {
      lat: mapCenterPoint.value.lat,
      lng: mapCenterPoint.value.lng
    }
  } else {
    const latlng = (route.params.latlng as string).split(',')
    centerPoint.value = {
      lat: +latlng[0].replace('_', '.'),
      lng: +latlng[1].replace('_', '.')
    }
  }
  if (map.value == null) return
  map.value.flyTo(centerPoint.value, mapZoom.value)
}, {
  immediate: true
})

const sortedMartList = computed<MartDataType[]>(() => {
  const theMap = map.value
  if (theMap == null) return []
  
  const center = centerPoint.value
  if (center == null) return []
  const martListInMap = getMartListInMap()
  return martListInMap.sort((a, b) => {
    return theMap.distance([center.lat, center.lng], [a.lat, a.lng]) - theMap.distance([center.lat, center.lng], [b.lat, b.lng])
  })
})

watch(sortedMartList, () => {
  updateSortedMartList(sortedMartList.value)

  const martListInMap = getMartListInMap()
  setMarkers(martListInMap)
})

function getCenterPoint() {
  if (map.value == null) return
  return map.value.getCenter()
}

// 獲取 GPS 位置
const { coords } = useGeolocation()
if (route.params.latlng === '') {
  watchOnce(coords, () => {
    if (isFinite(coords.value.latitude) && isFinite(coords.value.longitude)) {
      if (map.value == null) return
      map.value.panTo([coords.value.latitude, coords.value.longitude])
    }
  })
}

function turnLatLngToParam({ lat, lng }: {
  lat: number
  lng: number
}) {
  return `${String(lat).replace('.', '_')},${String(lng).replace('.', '_')}`
}


onMounted(() => {
  if (mapEl.value == null)
    return

  if (centerPoint.value == null) return


  router.replace({
    name: 'home',
    params: {
      latlng: turnLatLngToParam(centerPoint.value)
    }
  })

  map.value = L.map(mapEl.value, {
    center: centerPoint.value,
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

    const center = getCenterPoint()
    if (center == null) return

    router.push({
      ...route,
      params: {
        latlng: turnLatLngToParam({lat: center.lat, lng: center.lng})
      }
    })
        
  })
})

</script>

<template>
  <div class="map" ref="mapEl" />
</template>
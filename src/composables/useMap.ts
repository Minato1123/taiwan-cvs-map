import L from 'leaflet'
import type { PointType, BoundType, MartDataType } from '../types/index'
import type { MaybeRef, Ref } from 'vue'

export function useMap({
  centerPoint,
  currentZoom,
  updateZoom,
  currentLatLng,
  updateLatLng,
  pushRouter
}: {
  centerPoint: MaybeRef<PointType>
  currentZoom: MaybeRef<number>
  updateZoom: (zoom: number) => void
  currentLatLng: Ref<PointType | null>
  updateLatLng: (latlng: PointType, replace?: boolean) => void
  pushRouter: (replace?: boolean) => void
}) {

  const mapEl = ref<HTMLElement | null>(null)
  const map = shallowRef<L.Map | null>(null)

  function getMapBound(): BoundType {
    if (map.value == null) 
      throw new Error('Map does not exist.')

    const bound = map.value.getBounds()
    return {
      east: bound.getEast(),
      north: bound.getNorth(),
      west: bound.getWest(),
      south: bound.getSouth()
    }
  }

  function getMapZoom(): number {
    if (map.value == null) 
      throw new Error('Map does not exist.')

    return map.value.getZoom()
  }

  function updateCurrentMart(mart: MartDataType) {
    currentMart.value = mart
  }

  const martMarkerList = ref<(L.Marker<any> | undefined)[]>([])
  const currentMart = ref<MartDataType | null>(null)
  const iconSize = computed<number>(() => unref(currentZoom) * 1.5)
  const theIconSize = computed<number>(() => unref(currentZoom) * 2.4)
  
  function setMarkers(martList: MartDataType[]) {
    if (martMarkerList.value != null) {
      martMarkerList.value.forEach((marker)=> {
        if (marker == null) return
        marker.remove()
      })
      martMarkerList.value = []
    }
    
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
  
      const theMart = unref(currentMart)
      const isTheMart = theMart && theMart && theMart.pkey === mart.pkey ? true : false
  
      return L.marker([mart.lat, mart.lng], {
        icon: isTheMart ? theMartIcon : familyMartIcon,
        alt: mart.name,
        title: mart.name,
      }).addTo(map.value).on('click', () => {

        updateLatLng({
          lat: mart.lat,
          lng: mart.lng
        })
        if (unref(currentZoom) <= 17) updateZoom(17)
        pushRouter()
        updateCurrentMart(mart)
      })
    })
  }

  const { coords } = useGeolocation()
  const gpsLatlng = computed<PointType | null>(() => {
    if (isFinite(coords.value.latitude) && isFinite(coords.value.longitude)) {
      return {
        lat: coords.value.latitude,
        lng: coords.value.longitude
      }
    }
    
    return null
  })

  function moveToGpsLatlng() {
    if (map.value == null) return
    
    if (gpsLatlng.value != null) {
      map.value.flyTo(gpsLatlng.value)
      updateLatLng(gpsLatlng.value)
      if (unref(currentZoom) <= 16) updateZoom(16)
      pushRouter()
      return
    }

    let isGotLatlng = false
    const stop = watch(coords, () => {
      if (map.value == null || gpsLatlng.value == null) return
      isGotLatlng = true
      map.value.panTo(gpsLatlng.value)
      updateLatLng(gpsLatlng.value)
      if (unref(currentZoom) <= 16) updateZoom(16)
      pushRouter()
      stop()
    })

    if (!isGotLatlng) {
      setTimeout(() => {
        stop()
      }, 3000)
    }
  }

  
  onMounted(() => {
    if (mapEl.value == null)
      return

    const center = currentLatLng.value ?? unref(centerPoint)

    map.value = L.map(mapEl.value, {
      center: center,
      zoom: unref(currentZoom),
      zoomControl: true
    })

    if (currentLatLng.value == null) {
      console.log('123')
      moveToGpsLatlng()
    }

    updateLatLng(center, true)
    pushRouter(true)


    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map.value)

    map.value.on('zoomend', () => {
      updateZoom(getMapZoom())
      pushRouter()
    })

    map.value.on('moveend', () => {
      if (map.value == null) return  
      updateLatLng(map.value.getCenter(), true)
      pushRouter()
    })

    watch(currentLatLng, () => {
      if (map.value == null) return
      if (currentLatLng.value == null) return
  
      map.value.flyTo(currentLatLng.value, unref(currentZoom))
    })
  })

  return {
    map,
    mapEl,
    getMapBound,
    getMapZoom,
    currentMart,
    updateCurrentMart,
    setMarkers,
    moveToGpsLatlng
  }
}
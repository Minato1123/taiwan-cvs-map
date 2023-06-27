<script setup lang="ts">
import data from '../assets/json/data.json'
import MartMap from '../components/MartMap.vue'
import TheFilterMenu from '../components/TheFilterMenu.vue'
import InfoList from '../components/InfoList.vue'
import TheFooter from '@/components/TheFooter.vue'
import { useRouterUrl } from '@/composables/useRouterUrl'
import { useMap } from '@/composables/useMap'
import { useMartList } from '@/composables/useMartList'
import { useServiceList } from '@/composables/useServiceList'
import type { MartDataType } from '@/types'

const { 
  currentLatLng,
  updateLatLng,
  currentZoom,
  updateZoom,
  currentServiceList,
  updateServices,
  pushRouter,
} = useRouterUrl()

const centerPoint = {
  lat: 25.023293,
  lng: 121.468481
}

const { map, mapEl, getMapBound, updateCurrentMart, setMarkers, moveToGpsLatlng } = useMap({
  centerPoint,
  currentZoom,
  updateZoom,
  currentLatLng,
  updateLatLng,
  pushRouter
})

const useMapElRef = () => mapEl
const { serviceMap, getServiceListByMart } = useServiceList()

const allMartList: MartDataType[] = data as MartDataType[]
const showMartZoomLimit = 15
const { 
  getRecommendMartList,
  searchByMartName,
  searchByMartNumber 
} = useMartList({ allMartList })

const showMartList = ref<MartDataType[]>([])
function updateShowMartList() {
  const bounds = getMapBound()

  if (map.value == null) {
    showMartList.value = []
    return
  }
  
  if (bounds == null || currentZoom.value < showMartZoomLimit) {
    showMartList.value = []
    return
  }

  showMartList.value = allMartList.filter((mart) => {
    if (mart.lat > bounds.north)
      return false
    else if (mart.lat < bounds.south)
      return false
    else if (mart.lng > bounds.east)
      return false
    else if (mart.lng < bounds.west)
      return false

    if (unref(currentServiceList).length <= 0) return true

    return unref(currentServiceList).every((service) => {
      return mart.service.includes(service)
    })
  })
}

onMounted(() => {
  updateShowMartList()
  setMarkers(showMartList.value)
  if (map.value == null) return

  map.value.on('moveend', () => {
    updateShowMartList()
    setMarkers(showMartList.value)
  })
})


const sortedMartList = computed<MartDataType[]>(() => {
  const center = currentLatLng.value
  if (center == null) return []

  const theMap = map.value
  if (theMap == null) return []
  
  return showMartList.value.sort((a, b) => {
    return theMap.distance([center.lat, center.lng], [a.lat, a.lng]) - theMap.distance([center.lat, center.lng], [b.lat, b.lng])
  })
})


const useMartInfo = () => {
  return {
    sortedMartList,
    updateCurrentMart,
    updateLatLng,
    updateZoom,
    getServiceListByMart,
    pushRouter
  }
}

const useMenu = () => {
  return {
    serviceMap,
    searchByMartName,
    searchByMartNumber,
    updateCurrentMart,
    currentLatLng,
    updateLatLng,
    updateZoom,
    updateServices,
    getRecommendMartList,
    currentServiceList,
    pushRouter
  }
}

const { width } = useWindowSize()
const isMobile = computed(() => width.value < 901)
</script>

<template>
  <div class="outer-container">
    <div class="nav-main-container">
      <div class="nav-container">
        <a class="logo-container" @click="moveToGpsLatlng"><img class="nav-icon" src="familymart-icon.svg" alt=""><span class="nav-title">FamilyMart Map</span></a>
      </div>
      <main class="main-container">
        <TheFilterMenu v-if="!isMobile" class="menu-container" :useMenu="useMenu" />
        <div class="mart-container">
          <MartMap class="map-container" :useMapElRef="useMapElRef" />
          <TheFilterMenu v-if="isMobile" class="menu-container" :useMenu="useMenu" />
          <InfoList class="info-container" :useMartInfo="useMartInfo" />
        </div>
      </main>
    </div>
    <TheFooter class="footer-container" />
  </div>
</template>

<style lang="scss" scoped>

.outer-container {
  width: 100vw;
  min-height: 100vh;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .nav-main-container {
    width: 100%;
  }

  .nav-container {
    width: 100%;
    height: 3rem;
    background-color: rgb(var(--main-color));
    display: flex;
    justify-content: center;
    align-items: center;

    .logo-container {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 0.5rem;
      text-decoration: none;
      cursor: pointer;

      .nav-icon {
        height: 1.6rem;
      }
  
      .nav-title {
        color: rgb(var(--white-color));
        font-weight: 500;
        font-size: 1.4rem;
      }
    }
  }

  .main-container {
    display: flex;
    justify-content: center;
    box-sizing: border-box;
    margin: auto;
    gap: 1rem;

    .mart-container {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      .map-container {
        width: 100%;
      }

      .info-container {
        width: 100%;
      }
    }
  }

  .footer-container {
    width: 100%;
    min-height: 3rem;
    margin-top: 2rem;
  }
}

@media screen and (min-width: 1271px) {
  .main-container {
    width: 70%;
  }
}

@media screen and (max-width: 1270px) {
  .main-container {
    width: 90%;
  }
}

@media screen and (min-width: 901px) {
  .nav-container {
    margin-bottom: 1rem;
  }
  .menu-container {
    min-width: 16rem;
  }
}

@media screen and (max-width: 900px) {

  .nav-container {
    margin-bottom: 0.5rem;
  }
  .main-container {
    width: 100%;
    flex-direction: column;
    padding: 0 0.5rem;

    .menu-container {
      width: 100%;
    }
  }
}

@media screen and (min-width: 586px) {
  .main-container {
    .map-container {
      aspect-ratio: 1.8;
    }
  }
}

@media screen and (max-width: 585px) {
  .main-container {
    .map-container {
      aspect-ratio: 1.2;
    }
  }
}
</style>
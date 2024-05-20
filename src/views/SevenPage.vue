<script setup lang="ts">
import data from '@/assets/json/s_data.json'
import MartMap from '../components/MartMap.vue'
import TheFilterMenu from '../components/TheFilterMenu.vue'
import InfoList from '../components/InfoList.vue'
import TheFooter from '@/components/TheFooter.vue'
import { useRouterUrl } from '@/composables/useRouterUrl'
import { useMap } from '@/composables/useMap'
import { useMartList } from '@/composables/useMartList'
import { useServiceList } from '@/composables/useServiceList'
import type { MartDataType } from '@/types'
import { useTitle } from '@vueuse/core'

useTitle('7-11 門市地圖')

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
  pushRouter,
  store: '7-11'
})

const useMapElRef = () => mapEl
const { serviceMap, getServiceListByMart } = useServiceList('7-11')

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
      return mart.service.includes(service as any)
    })
  })
}

onMounted(() => {
  const html = document.querySelector('html')
  html?.setAttribute('theme', '7-11')
  
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
    getServiceListByMart: getServiceListByMart as (serivce: string) => string,
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

const router = useRouter()
const route = useRoute()
</script>

<template>
  <div class="outer-container">
    <div class="nav-main-container">
      <div class="nav-container">
        <a class="logo-container" @click="moveToGpsLatlng"><img class="nav-icon" src="/7-eleven_logo.svg" alt=""><span class="nav-title">7-11 門市地圖</span></a>
        <button 
          class="another-map-btn"
          @click="router.push({ name: 'familymart', params: { ...route.params }, query: { zoom: route.query.zoom } })"
        >
          全家
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><g fill="none"><path d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"/><path fill="currentColor" d="M11 6a1 1 0 1 1 0 2H5v11h11v-6a1 1 0 1 1 2 0v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2zm9-3a1 1 0 0 1 1 1v5a1 1 0 1 1-2 0V6.414l-8.293 8.293a1 1 0 0 1-1.414-1.414L17.586 5H15a1 1 0 1 1 0-2Z"/></g></svg>
        </button>
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

    .another-map-btn {
      display: flex;
      align-items: center;
      gap: 0.2rem;
      background-color: transparent;
      outline: none;
      border: 1px solid rgb(var(--white-color));
      padding: 0.3rem 0.5rem;
      border-radius: 0.5rem;
      color: rgb(var(--white-color));
      margin-left: 1rem;
      cursor: pointer;
      transition: all 0.3s;
    }

    .another-map-btn:hover {
      background-color: rgba(var(--white-color), 0.1);
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
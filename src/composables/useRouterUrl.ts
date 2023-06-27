
import type { PointType, ServiceType } from '@/types'
import type { MaybeRef } from 'vue'
import type { RouteLocationPathRaw, RouteLocationNamedRaw } from 'vue-router'

export function useRouterUrl() {
  const route = useRoute()
  const router = useRouter()
  const theRoute = ref<RouteLocationPathRaw | RouteLocationNamedRaw>({
    ...route
  })

  function turnLatLngToParam({ lat, lng }: PointType) {
    return `${String(lat).replace('.', '_')},${String(lng).replace('.', '_')}`
  }

  function turnParamToLatLng(str: MaybeRef<string>): PointType | null {
    const latlngList = unref(str).split(',')

    if (latlngList.length !== 2) return null
    const latStr = latlngList[0].replace('_', '.').trim()
    const lngStr = latlngList[1].replace('_', '.').trim()

    const lat = +latStr
    const lng = +lngStr
    if (isNaN(lat) || isNaN(lng)) return null
    if (lat > 27 || lat < 21 || lng < 117 || lng > 122) return null
    
    return {
      lat,
      lng
    }
  }

  const defaultZoom = 17
  const paramZoom = computed<string>(() => route.query.zoom as string)
  const currentZoom = computed<number>(() => {
    const zoom = paramZoom.value
    if (zoom === '' || zoom == null || isNaN(+zoom))
      return defaultZoom

    return +zoom
  })

  watch(currentZoom, () => {
    if (currentZoom.value > 18) updateZoom(18)
    if (currentZoom.value < 0) updateZoom(0)
    pushRouter()
  }, {
    immediate: true
  })

  function updateZoom(zoom: number) {
    theRoute.value = {
      ...theRoute.value,

      query: {
        ...theRoute.value.query,
        zoom: String(zoom)
      }
    }
  }

  const paramLatlng = computed<string>(() => route.params.latlng as string)
  const currentLatLng = computed<PointType | null>(() => {
    if (paramLatlng.value === '' || paramLatlng.value == null)
      return null

    return turnParamToLatLng(paramLatlng)
  })

  function updateLatLng(latlng: PointType) {
    theRoute.value = {
      ...theRoute.value,
      params: {
        latlng: turnLatLngToParam(latlng)
      },
    }
  }

  const query = computed<string>(() => route.query.services as string)
  const currentServiceList = computed<ServiceType[]>(() => {
    if (query.value === '' || query.value == null) return [] as ServiceType[]
    return query.value.split(',') as ServiceType[]
  })

  function updateServices(serviceList: ServiceType[]) {
    if (serviceList.length > 0) {
      theRoute.value = {
        ...theRoute.value,
        query: {
          ...theRoute.value.query,
          services: serviceList.join(',')
        },
      }
    } else {
      theRoute.value = {
        ...theRoute.value,
        query: {
          ...theRoute.value.query,
          services: undefined
        },
      }
    }
  }

  function pushRouter(replace: boolean = false) {
    router.push({
      ...theRoute.value,
      replace
    })
  }

  return {
    currentLatLng,
    updateLatLng,
    currentZoom,
    updateZoom,
    currentServiceList,
    updateServices,
    pushRouter,
  }
}
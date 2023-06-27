<script setup lang="ts">
import { OnClickOutside } from '@vueuse/components'
import LatLngInputDialog from './LatLngInputDialog.vue'
import MessageDialog from './MessageDialog.vue'
import type { ServiceType, MartDataType, PointType } from '../types/index'
import type { MaybeRef } from 'vue'

const props = defineProps<{
  useMenu: () => {
    serviceMap: {[x in ServiceType]: string}
    searchByMartName: (name: MaybeRef<string>) => MartDataType | null
    searchByMartNumber: (number: MaybeRef<string>) => MartDataType | null
    updateCurrentMart: (mart: MartDataType) => void
    currentLatLng: Ref<PointType | null>
    updateLatLng: (latlng: PointType, replace?: boolean) => void
    updateZoom: (zoom: number) => void
    getRecommendMartList: (address: MaybeRef<string>) => MartDataType[]
    updateServices: (serviceList: ServiceType[]) => void
    currentServiceList: Ref<ServiceType[]>
    pushRouter: (replace?: boolean) => void
  }
}>()

const { 
  serviceMap,
  searchByMartName,
  updateCurrentMart,
  searchByMartNumber,
  updateLatLng,
  updateZoom,
  updateServices,
  getRecommendMartList,
  currentServiceList,
  pushRouter
} = props.useMenu()

const useInputDialog = () => {
  return {
    updateLatLng,
    updateZoom,
    pushRouter
  }
}

const searchPicked = ref<'address' | 'mart-name' | 'mart-number'>('address')

watch(searchPicked, () => {
  addressInput.value = ''
  martNameInput.value = ''
  martNumberInput.value = ''
})

const addressInput = ref<string>('')
const addressInputEl = ref<HTMLElement | null>(null)
const martNameInput = ref<string>('')
const martNameInputEl = ref<HTMLElement | null>(null)

const martNumberInput = ref<string>('')
const martNumberInputEl = ref<HTMLElement | null>(null)
const recommendMartList = ref<MartDataType[]>()

const isOpenMessageDialog = ref(false)
function submitInput(e: KeyboardEvent) {
  if (e.isComposing) return
  
  if (searchPicked.value === 'mart-name') {
    const mart = searchByMartName(martNameInput.value)
    if (mart == null) {
      isOpenMessageDialog.value = true
      return
    }

    updateCurrentMart(mart)
    updateLatLng({
      lat: mart.lat,
      lng: mart.lng
    })
  }
  else if (searchPicked.value === 'mart-number') {
    const mart = searchByMartNumber(martNumberInput.value)
    if (mart == null) {
      isOpenMessageDialog.value = true
      return
    }

    updateCurrentMart(mart)
    updateLatLng({
      lat: mart.lat,
      lng: mart.lng
    })

  }
  updateZoom(17)
  pushRouter()
}

function submitMart(mart: MartDataType) {
  updateLatLng({
    lat: mart.lat,
    lng: mart.lng
  })
  updateZoom(17)
  updateCurrentMart(mart)
  pushRouter()
}

const isFocus = ref<boolean>(false)
const isTyping = computed<boolean>(() => addressInput.value.trim() !== '')

watch(addressInput, () => {
  if (addressInput.value.trim() === '') return
  recommendMartList.value = getRecommendMartList(addressInput.value)
})

const recommendListEl = ref<HTMLElement | null>(null)
  const { y: recommendListElY } = useScroll(recommendListEl, {
    behavior: 'smooth'
  })

const selectedIndex = ref(-1)
function handleAddressInputKeyBoardEvent(e: KeyboardEvent) {
  isFocus.value = true
  if (e.isComposing) return
  if (!isFocus.value || !isTyping.value) return
  if (recommendMartList.value == null || recommendListEl.value == null) return

  if (e.key === 'ArrowUp') {
    if (selectedIndex.value <= 0) return
    selectedIndex.value -=1
    recommendListElY.value = ([...recommendListEl.value.children][selectedIndex.value] as HTMLElement).offsetTop - 20
    
  } else if (e.key === 'ArrowDown') {
    if (selectedIndex.value >= recommendMartList.value.length) return
    selectedIndex.value += 1
    recommendListElY.value = ([...recommendListEl.value.children][selectedIndex.value] as HTMLElement).offsetTop - 20
  } else if (e.key === 'Enter') {
    if (selectedIndex.value === recommendMartList.value.length) {
      isOpenLatLngInputDialog.value = true
    } else {
      submitMart(recommendMartList.value[selectedIndex.value])
    }
    isFocus.value = false
  }
}

watch(isFocus, () => {
  selectedIndex.value = -1
})

const checkedServiceList = ref<ServiceType[]>([])

watch(checkedServiceList, () => {
  updateServices(checkedServiceList.value)
  pushRouter()
})

watch(currentServiceList, () => {
  if (currentServiceList.value.length > 0)
    checkedServiceList.value = currentServiceList.value
  else
    checkedServiceList.value = []
}, {
  immediate: true
})

const { width } = useWindowSize()
const isShowToggle = computed(() => width.value < 901)
const isOpenMenu = ref(false)
const isShowMenu = computed(() => width.value >= 901 || isOpenMenu.value === true)

const isOpenLatLngInputDialog = ref(false)
</script>

<template>
  <div class="menu-outer">
    <div v-if="isShowToggle" class="mobile-menu-toggle">
      <button class="toggle-btn" @click="isOpenMenu = !isOpenMenu">
        {{ isOpenMenu === true ? '關閉' : '開啟' }} 搜尋條件
      </button>
    </div>
    <Transition>
      <div v-if="isShowMenu" class="menu" :class="{
        'gap-top': isShowToggle && isShowMenu
      }">
        <div class="menu-block">
          <div class="menu-title">
            搜尋條件
          </div>
          <div class="menu-search-content">
            <label for="address" class="menu-label" @click="addressInputEl?.focus">
              <input name="search" id="address" type="radio" value="address" v-model="searchPicked">
              依地址周邊查詢
            </label>
            <div class="search-block" :class="{
              'hide': searchPicked !== 'address'
            }">
              <OnClickOutside @trigger="isFocus = false">
                <VDropdown placement="bottom-start" :preventOverflow="false" :triggers="[]" :shown="isTyping && isFocus" :auto-hide="false">
                  <input ref="addressInputEl" @click="isFocus = true" @focus="isFocus = true"  class="search-input" type="text" placeholder="縣市／區域／街道" v-model="addressInput" autocomplete="nope" @keydown="handleAddressInputKeyBoardEvent">
                  <template #popper>
                    <ul class="search-recommend-list" ref="recommendListEl">
                      <li class="recommend-item" v-for="(mart, i) in recommendMartList" :key="`recommend-mart-${mart.pkey}`">
                        <button class="item" :class="{
                          'active': i === selectedIndex
                        }" @click="submitMart(mart)">
                          <div class="recommend-mart-name">
                            {{ mart.name }}
                          </div>
                          <div class="recommend-mart-address" v-html="mart.address" />
                        </button>
                      </li>
                      <li class="recommend-item">
                        <button class="item" :class="{
                          'active': recommendMartList?.length === selectedIndex
                        }" @click="isOpenLatLngInputDialog = true">
                          <div class="item-footer">
                            根據此地址搜尋附近的全家
                            <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24"><path fill="currentColor" fillRule="evenodd" d="M5 20h14v2H5v-2zm7-13c-1.1 0-2 .9-2 2s.9 2 2 2a2 2 0 1 0 0-4zm0-5c3.27 0 7 2.46 7 7.15c0 3.12-2.33 6.41-7 9.85c-4.67-3.44-7-6.73-7-9.85C5 4.46 8.73 2 12 2z"></path></svg>
                          </div>
                        </button>
                      </li>
                    </ul>
                  </template>
                </VDropdown>
              </OnClickOutside>
            </div>
            <label for="mart-name" class="menu-label" @click="martNameInputEl?.focus">
              <input name="search" id="mart-name" type="radio" value="mart-name" v-model="searchPicked">
              依店名查詢
            </label>
            <div class="search-block" :class="{
              'hide': searchPicked !== 'mart-name'
            }">
              <input ref="martNameInputEl" class="search-input" type="text" v-model="martNameInput" @keyup.enter="submitInput">
            </div>
            <label for="mart-number" class="menu-label" @click="martNumberInputEl?.focus">
              <input name="search" id="mart-number" type="radio" value="mart-number" v-model="searchPicked">
              依店號查詢
            </label>
            <div class="search-block" :class="{
              'hide': searchPicked !== 'mart-number'
            }">
              <input ref="martNumberInputEl" class="search-input" type="text" maxlength="6" placeholder="共 6 碼" v-model="martNumberInput" @keyup.enter="submitInput">
            </div>
          </div>
        </div>
        <div class="menu-block">
          <div class="menu-title">
            服務項目篩選
          </div>
          <div class="menu-content">
            <label class="menu-item" v-for="service of (Object.keys(serviceMap) as ServiceType[])" :key="service" :for="service">
              <input class="menu-item-input" :id="service" type="checkbox" :value="service" v-model="checkedServiceList">
              {{ serviceMap[service] }}
            </label>
          </div>
        </div>
      </div>
    </Transition>
    <Teleport to="body">
      <Transition>
        <LatLngInputDialog v-if="isOpenLatLngInputDialog" :address="addressInput" :useInputDialog="useInputDialog" @closeLatLngInputDialog="isOpenLatLngInputDialog = false" />
      </Transition>
    </Teleport>
    <Teleport to="body">
      <Transition>
        <MessageDialog v-if="isOpenMessageDialog" :searchMethod="searchPicked" @closeMessageDialog="isOpenMessageDialog = false" />
      </Transition>
    </Teleport>
  </div>
</template>

<style lang="scss" scoped>

.mobile-menu-toggle {
  width: 100%;
  display: flex;
  justify-content: center;

  .toggle-btn {
    width: 60%;
    font-weight: 500;
    color: rgb(var(--white-color));
    background-color: rgb(var(--match-color));
    border-radius: 1rem;
    outline: none;
    border: none;
    padding: 0.5rem 0;
    cursor: pointer;
  }
}
.menu {

  &.gap-top {
    margin-top: 0.5rem;
  }
  .menu-block {
    .menu-title {
      background-color: rgb(var(--match-color));
      color: rgb(var(--white-color));
      padding: 0.3rem 0 0.3rem 1rem;
      border-radius: 1rem;
    }

    .menu-search-content {
      display: flex;
      flex-direction: column;
      padding: 1rem;

      .menu-label {
        cursor: pointer;
        padding: 0.3rem 0;
        transition: all 0.3s;
        
        &:hover {
          opacity: 0.7;
        }
      }

      .search-block {
        margin-left: 1.5rem;
        overflow-y: hidden;
        max-height: 1.7rem;
        transition: all 0.4s;

        &.hide {
          max-height: 0;
          opacity: 0;
        }

        .search-input {
          height: 1.5rem;
          padding: 0.1rem 0 0.1rem 0.3rem;
          font-size: 1rem;
          outline: none;
          width: 100%;
          box-sizing: border-box;
          
        }
      }
    }

    .menu-content {
      display: flex;
      flex-direction: column;
      padding: 1rem;
      gap: 0.5rem;

      .menu-item {
        cursor: pointer;
        transition: all 0.3s;

        &:hover {
          opacity: 0.7;
        }

        .menu-item-input {
          outline: none;
          margin-right: 0.2rem;
        }
      }
    }
  }
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>

<style>
.v-popper__arrow-container {
  display: none;
}

.v-popper__popper > .v-popper__wrapper > .v-popper__inner {
  border: 0.1rem solid rgba(var(--match-color), 0.9);
  width: 16rem;
}

.search-recommend-list {
  padding: 0;
  margin: 0;
  max-height: 14rem;
  overflow-y: auto;
}

.recommend-item {
  width: 100%;
  list-style-type: none;
  border-bottom: 0.1rem solid rgba(var(--match-color), 0.9);
}

.item {
  width: 100%;
  padding: 0.5rem;
  outline: none;
  border: none;
  background: transparent;
  transition: all 0.3s;
  text-align: left;
}

.item:hover, .item:focus, .active {
  background-color: rgba(var(--match-color), 0.1);
  cursor: pointer;
}

.item-footer {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.2rem;
  padding: 0.5rem 0;
}



.recommend-mart-address {
  margin-top: 0.5rem;
  font-size: 0.85rem;
  opacity: 0.8;
}

.search-keyword {
  color: rgb(var(--match-color));
  font-weight: 500;
}

@media screen and (max-width: 900px) {
  
}

</style>
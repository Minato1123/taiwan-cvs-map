<script setup lang="ts">
import { OnClickOutside } from '@vueuse/components'
import { useServiceStore } from '../stores/service'
import { useMapStore } from '../stores/map'
import type { ServiceType, MartDataType } from '../types/index'
const { serviceMap } = useServiceStore()
const { updateSelectedServiceList, searchByAddress, getRecommendMartList, searchByMartName, searchByMartNumber } = useMapStore()

const searchPicked = ref<'address' | 'mart-name' | 'mart-number'>('address')

const addressInput = ref<string>('')
const addressInputEl = ref<HTMLElement | null>(null)
const martNameInput = ref<string>('')
const martNameInputEl = ref<HTMLElement | null>(null)

const martNumberInput = ref<string>('')
const martNumberInputEl = ref<HTMLElement | null>(null)
const recommendMartList = ref<MartDataType[]>()

function submitInput(e: KeyboardEvent) {
  if (e.isComposing) return
  
  if (searchPicked.value === 'mart-name')
    searchByMartName(martNameInput.value)
  else if (searchPicked.value === 'mart-number')
    searchByMartNumber(martNumberInput.value)
}

function submitMart(mart: MartDataType) {
  searchByAddress(mart)
  isFocus.value = false
}


const isFocus = ref<boolean>(false)
const isTyping = ref<boolean>(false)
watch(addressInput, () => {
  if (addressInput.value.trim() === '') {
    isTyping.value = false
    return
  }

  isTyping.value = true
  recommendMartList.value = getRecommendMartList(addressInput.value)
})


const checkedServiceList = ref<ServiceType[]>([])

watch(checkedServiceList, () => {
  updateSelectedServiceList(checkedServiceList.value)
})

</script>

<template>
  <div class="menu">
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
            <VDropdown :triggers="[]" :shown="isTyping && isFocus && recommendMartList && recommendMartList.length > 0" :auto-hide="false">
              <input ref="addressInputEl" @focus="isFocus = true"  class="search-input" type="text" placeholder="縣市／區域／街道" v-model="addressInput">
              <template #popper>
                <ul class="search-recommend-list">
                  <li class="recommend-item" v-for="mart in recommendMartList" :key="`recommend-mart-${mart.pkey}`">
                    <button class="item" @click="submitMart(mart)" @keyup.enter="submitMart(mart)">
                      <div class="recommend-mart-name">
                        {{ mart.name }}
                      </div>
                      <div class="recommend-mart-address" v-html="mart.address" />
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
          <input ref="martNumberInputEl" class="search-input" type="text" placeholder="共 6 碼" v-model="martNumberInput" @keyup.enter="submitInput">
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
</template>

<style lang="scss" scoped>
.menu {
  border-left: 0.2rem solid rgb(var(--match-color));

  .menu-block {
    margin-bottom: 1rem;

    .menu-title {
      background-color: rgb(var(--match-color));
      color: rgb(var(--white-color));
      padding: 0.2rem 0 0.2rem 0.5rem;
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
          height: 1.2rem;
          padding: 0.1rem 0 0.1rem 0.3rem;
          font-size: 1rem;
          outline: none;

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
</style>

<style>
.v-popper__arrow-container {
  display: none;
}

.v-popper__popper > .v-popper__wrapper > .v-popper__inner {
  border: 0.1rem solid rgba(var(--match-color), 0.9);
  width: 14rem;
}

.search-recommend-list {
  padding: 0;
  margin: 0;
  max-height: 14rem;
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

.item:hover {
  background-color: rgba(var(--match-color), 0.05);
  cursor: pointer;
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

</style>
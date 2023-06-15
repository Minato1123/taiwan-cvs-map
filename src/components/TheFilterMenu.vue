<script setup lang="ts">
import { useServiceStore } from '../stores/service'
import { useMapStore } from '../stores/map'
import type { ServiceType } from '../types/index'
const { serviceMap } = useServiceStore()
const { updateSelectedServiceList, searchByAddress, searchByMartName, searchByMartNumber } = useMapStore()

const searchPicked = ref<'address' | 'mart-name' | 'mart-number'>('address')

const addressInput = ref<string>('')
const addressInputEl = ref<HTMLElement | null>(null)
const martNameInput = ref<string>('')
const martNameInputEl = ref<HTMLElement | null>(null)

const martNumberInput = ref<string>('')
const martNumberInputEl = ref<HTMLElement | null>(null)

function submitInput(e: KeyboardEvent) {
  if (e.isComposing) return
  
  console.log(searchPicked.value)
  if (searchPicked.value === 'address')
    searchByAddress(addressInput.value)
  else if (searchPicked.value === 'mart-name')
    searchByMartName(martNameInput.value)
  else if (searchPicked.value === 'mart-number')
    searchByMartNumber(martNumberInput.value)
}

const isFocus = ref<boolean>(false)
watch(isFocus, () => {
  if (isFocus.value === false) return
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
          <input @focus="isFocus = true" @blur="isFocus = false" ref="addressInputEl" class="search-input" type="text" placeholder="縣市／區域／街道" v-model="addressInput" @keyup.enter="submitInput">
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
<script setup lang="ts">
import { useServiceStore } from '../stores/service'
const { serviceMap } = useServiceStore()

const searchPicked = ref<'address' | 'mart-name' | 'mart-no'>('address')
const checkedServiceList = ref<string[]>([])
</script>

<template>
  <div class="menu">
    <div class="menu-block">
      <div class="menu-title">
        搜尋條件
      </div>
      <div class="menu-search-content">
        <label for="address" class="menu-label">
          <input name="search" id="address" type="radio" value="address" v-model="searchPicked">
          依地址周邊查詢
        </label>
        <div class="search-block" :class="{
          'hide': searchPicked !== 'address'
        }">
          <input class="search-input" type="text" placeholder="縣市／區域／街道">
        </div>
        <label for="mart-name" class="menu-label">
          <input name="search" id="mart-name" type="radio" value="mart-name" v-model="searchPicked">
          依店名查詢
        </label>
        <div class="search-block" :class="{
          'hide': searchPicked !== 'mart-name'
        }">
          <input class="search-input" type="text">
        </div>
        <label for="mart-no" class="menu-label">
          <input name="search" id="mart-no" type="radio" value="mart-no" v-model="searchPicked">
          依店號查詢
        </label>
        <div class="search-block" :class="{
          'hide': searchPicked !== 'mart-no'
        }">
          <input class="search-input" type="text" placeholder="共 6 碼">
        </div>
      </div>
    </div>
    <div class="menu-block">
      <div class="menu-title">
        服務項目篩選
      </div>
      <div class="menu-content">
        <label class="menu-item" v-for="service of Object.keys(serviceMap)" :key="service" :for="service">
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

        .menu-item-input {
          outline: none;
          margin-right: 0.2rem;
        }
      }
    }
  }
}
</style>
<script setup lang="ts">
import type { MartDataType, PointType, ServiceType } from '../types/index'

const props = defineProps<{
  useMartInfo: () => {
    sortedMartList: Ref<MartDataType[]>
    updateCurrentMart: (mart: MartDataType) => void
    updateLatLng: (latlng: PointType) => void
    updateZoom: (zoom: number) => void
    getServiceListByMart: (serivce: ServiceType) => string
    pushRouter: (replace?: boolean) => void
  }
}>()

const { 
  sortedMartList,
  updateCurrentMart,
  updateLatLng,
  updateZoom,
  getServiceListByMart,
  pushRouter
} = props.useMartInfo()

function clickMartInfo(mart: MartDataType) {
  updateLatLng({
    lat: mart.lat,
    lng: mart.lng
  })
  updateZoom(17)
  pushRouter()

  updateCurrentMart(mart)
  scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

</script>

<template>
  <div v-auto-animate class="info">
    <div class="info-bar">
      <span class="info-title">
        門市資訊
      </span>
      <a 
        :href="`data:application/json;charset=utf-8,${encodeURIComponent(JSON.stringify(sortedMartList, null, 2))}`"
        download="cvs-list.json"
        class="export-link"
      >
        Export JSON
      </a>
    </div>
    <div class="none-info" v-if="sortedMartList.length <= 0">
      當前地圖範圍內沒有符合條件的門市喔～
    </div>
    <div class="info-item" v-for="(mart, i) in sortedMartList" :key="`mart-${i}`" @click="clickMartInfo(mart)">
      <div class="item-content">
        <div class="mart-name-no">
          <span class="mart-name">
            {{ mart.name }}
            <a @click.stop :href="`https://www.google.com/maps/search/${mart.name}`" target="_blank" title="以 Google 地圖開啟" class="map-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5a2.5 2.5 0 0 1 0 5z"></path></svg>
            </a>
          </span>
          店舖號：{{ mart.id }}
        </div>
        <div>
          {{ mart.address }}
        </div>
        <div>
          {{ mart.tel }}
        </div>
      </div>
      <div class="item-services">
        <div class="item-service" v-for="service in mart.service" :key="service">
          {{ getServiceListByMart(service) }}
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .info {
    width: 100%;

    .info-bar {
      width: 100%;
      background-color: rgb(var(--main-color));
      color: rgb(var(--white-color));
      padding: 0.3rem 1rem;
      box-sizing: border-box;
      border-radius: 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .info-title {
        font-weight: 500;
      }

      .export-link {
        color: rgb(var(--white-color));
        font-size: 0.8rem;
        transition: all 0.3s;
      }

      .export-link:hover {
        opacity: 0.8;
      }
      
    }


    

    .none-info {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 5rem;
      color: rgb(var(--main-color));
      width: 100%;
      box-sizing: border-box;
    }

    .info-item {
      width: 100%;
      box-sizing: border-box;
      border-radius: 1rem;
      border: 0.15rem solid rgb(var(--main-color));
      margin-top: 1rem;
      padding: 1rem 2rem;
      display: flex;
      justify-content: space-between;
      transition: all 0.3s;

      &:hover {
        cursor: pointer;
        background-color: rgba(var(--main-color), 0.06);
      }

      .item-content {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        .mart-name {
          font-size: 1.2rem;
          font-weight: 500;
        }

        .map-btn {
          padding-left: 0;
          background: transparent;
          outline: none;
          border: none;
          color: rgb(var(--main-color));
          cursor: pointer;
          transition: all 0.3s;

          &:hover {
            opacity: 0.6;
          }
        }
      }

      .item-services {
        .item-service {
          display: inline-block;
          border-radius: 0.4rem;
          border: 0.1rem solid rgb(var(--main-color));
          padding: 0.3rem 0.6rem;
          color: rgb(var(--main-color));
          margin: 0.2rem;
        }
      }
    }
  }

  @media screen and (min-width: 1011px) {
    .item-services {
      width: 40%;
    }
  }

  @media screen and (max-width: 1010px) {
    .info-item {
      flex-direction: column;
      gap: 1rem;
      .item-services {
        width: 100%;
      }
    }
  }

  @media screen and (min-width: 461px) {
    .none-info {
      font-size: 1.2rem;
    }
  }

  @media screen and (max-width: 460px) {
    .none-info {
      font-size: 1rem;
    }
  }
</style>
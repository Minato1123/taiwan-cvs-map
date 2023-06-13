<script setup lang="ts">
import { useMapStore } from '../stores/map'
import { useServiceStore } from '../stores/service'

const { setCenterPoint } = useMapStore()
const { martListInMap } = storeToRefs(useMapStore())
const { getServiceListByMart } = useServiceStore()

function clickMartInfo(lat: number, lng: number) {
  setCenterPoint(lat, lng)
  scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

</script>

<template>
  <div class="info">
    <div class="info-title">門市資訊</div>
    <div class="info-item" v-for="(mart, i) in martListInMap" :key="`mart-${i}`" @click="clickMartInfo(mart.lat, mart.lng)">
      <div class="item-content">
        <div class="mart-name-no">
          <span class="mart-name">
            {{ mart.name }}
            <button class="map-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5a2.5 2.5 0 0 1 0 5z"></path></svg>
            </button>
          </span>
          店舖號：{{ mart.pkey }}
        </div>
        <div>
          {{ mart.address }}
        </div>
        <div>
          {{ mart.tel }}｜{{ mart.POSTel }}
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

    .info-title {
      width: 100%;
      background-color: rgb(var(--main-color));
      color: rgb(var(--white-color));
      font-weight: 500;
      padding: 0.2rem 0 0.2rem 0.5rem;
    }

    .info-item {
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
        width: 40%;
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
</style>
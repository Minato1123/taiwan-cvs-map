<script setup lang="ts">
import type { PointType } from '@/types'
import { OnClickOutside } from '@vueuse/components'

const props = defineProps<{
  address: string
  useInputDialog: () => {
    updateLatLng: (latlng: PointType) => void
    updateZoom: (zoom: number) => void
    pushRouter: (replace?: boolean) => void
  }
}>()
const emit = defineEmits<{
  (e: 'closeLatLngInputDialog'): void
}>()

const latlngInput = ref<string>('')
const { updateLatLng, updateZoom, pushRouter } = props.useInputDialog()

const errorMessage = ref('')

function checkInputLatlng(latlngStr: string): PointType | null {
  const [lat, lng] = latlngStr.split(',')
  if (isNaN(+lat) || isNaN(+lng)) {
    errorMessage.value = '經緯度格式不對喔！'
    return null
  } else if (+lat > 27 || +lat < 21 || +lng > 122 || +lng < 117) {
    errorMessage.value = '經緯度不正確，只適用於台灣地區喔！'
    return null
  } else {
    errorMessage.value = ''
    return {
      lat: +lat,
      lng: +lng
    }
  }

}

function clickConfirm() {
  const resultLatlng = checkInputLatlng(latlngInput.value.trim())
  
  if (resultLatlng == null) return
  updateLatLng(resultLatlng)
  updateZoom(16)
  pushRouter()
  emit('closeLatLngInputDialog')
}

function clickCancel() {
  emit('closeLatLngInputDialog')
}

const isBackgroundLocked = useScrollLock(window.document.body)
onMounted(() => {
  isBackgroundLocked.value = true
})
</script>

<template>
  <div class="mask">
    <OnClickOutside class="latlng-container" @trigger="$emit('closeLatLngInputDialog')">
      <div class="latlng-title">
        請提供經緯度給我！
      </div>
      <div>
        <div>
          <p>行動裝置：</p>
          <ol>
            <li>點進此<a class="link-btn" :href="`https://www.google.com/maps/search/${address}`" target="_blank">連結</a></li>
            <li>按著所需位置不放（沒有地標也沒關係）</li>
            <li>複製上方搜尋框出現的經緯度</li>
          </ol>
        </div>
        <div>
          <p>電腦：</p>
          <ol>
            <li>點進此<a class="link-btn" :href="`https://www.google.com/maps/search/${address}`" target="_blank">連結</a></li>
            <li>對著所需位置按下滑鼠右鍵</li>
            <li>點擊第一行的經緯度做複製</li>
          </ol>
        </div>
      </div>
      <div class="input-block">
        將內容在此直接貼上
        <input class="input" type="text" v-model="latlngInput" placeholder="25.023293,121.468481">
        <div class="input-error" v-if="errorMessage !== ''">{{ errorMessage }}</div>
      </div>
      <div class="btns-block">
        <button class="btn-cancel" @click="clickCancel">取消</button>
        <button class="btn-confirm" @click="clickConfirm">確定</button>
      </div>
    </OnClickOutside>
  </div>
</template>

<style lang="scss" scoped>
  .mask {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    background-color: rgba(#000, 0.3);
    .latlng-container {
      width: 100%;
      max-width: 30rem;
      min-height: 26rem;
      background-color: rgb(var(--white-color));
      border: 0.2rem solid rgb(var(--match-color));
      border-radius: 2rem;
      box-sizing: border-box;
      padding: 2rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;

      .latlng-title {
        display: flex;
        justify-content: center;
        align-items: center;
        color: rgb(var(--match-color));
        font-weight: 500;
        font-size: 1.3rem;
      }

      .link-btn {
        background-color: rgb(var(--match-color));
        box-sizing: border-box;
        padding: 0.2rem 0.8rem;
        margin-left: 0.3rem;
        margin-bottom: 0.2rem;
        display: inline-block;
        color: rgb(var(--white-color));
        border-radius: 0.5rem;
        cursor: pointer;
        transition: all 0.3s;
        text-decoration: none;

        &:hover {
          opacity: 0.85;
        }
      }

      .input-block {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;

        .input {
          border: none;
          outline: none;
          background-color: rgba(var(--match-color), 0.15);
          line-height: 1.5rem;
          box-sizing: border-box;
          padding: 0.3rem;

          &::placeholder {
            opacity: 0.45;
          }
        }

        .input-error {
          color: red;
          font-size: 0.9rem;
        }
      }

      .btns-block {
        display: flex;
        justify-content: space-around;

        .btn-cancel, .btn-confirm {
          padding: 0.4rem 2rem;
          border-radius: 0.6rem;
          font-weight: 500;
          outline: none;
          border: 0.2rem solid rgb(var(--match-color));
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-cancel {
          background-color: rgb(var(--white-color));
          color: rgb(var(--match-color));

          &:hover {
            background-color: rgba(var(--match-color), 0.1);
          }
        }

        .btn-confirm {
          background-color: rgb(var(--match-color));
          color: rgb(var(--white-color));

          &:hover {
            opacity: 0.8;
          }
        }
      }

    }
  }


</style>
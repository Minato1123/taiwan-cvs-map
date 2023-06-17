<script setup lang="ts">
import { OnClickOutside } from '@vueuse/components'

defineEmits<{
  (e: 'closeMessageDialog'): void
}>()
const props = defineProps<{
  searchMethod: 'address' | 'mart-name' | 'mart-number'
}>()

const searchName = computed(() => props.searchMethod === 'mart-name' ? '店名' : '店號')
</script>

<template>
  <div class="mask">
    <OnClickOutside class="message-container" @trigger="$emit('closeMessageDialog')">
      <div class="messgae">
        找不到符合此{{ searchName }}的門市ＱＱ
      </div>
      <div class="btn-block">
        <button class="btn" @click="$emit('closeMessageDialog')">知道了</button>
      </div>
    </OnClickOutside>
  </div>
</template>

<style lang="scss" scoped>

.mask {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    background-color: rgba(#000, 0.05);

    .message-container {
      width: 100%;
      max-width: 20rem;
      min-height: 10rem;
      background-color: rgb(var(--white-color));
      border-radius: 1rem;
      border: 0.2rem solid rgb(var(--match-color));
      box-sizing: border-box;
      padding: 1rem;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;

      .messgae {
        font-size: 1.2rem;
        font-weight: 500;
        color: rgb(var(--match-color));
      }

      .btn {
        background-color: rgb(var(--match-color));
        outline: none;
        border: none;
        border-radius: 1rem;
        box-sizing: border-box;
        padding: 0.5rem 1.5rem;
        color: rgb(var(--white-color));
        cursor: pointer;
        transition: all 0.3s;

        &:hover {
          opacity: 0.85;
        }

      }
    }

}
</style>
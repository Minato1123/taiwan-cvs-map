<script setup lang="ts">
</script>

<template>
  <footer class="footer-outer">
    <div class="footer-right">
      <div>
        Copyright © 2021 FamilyMart. All rights reserved.
      </div>
      <div class="footer-btns">
        <a class="footer__btn" href="https://github.com/Minato1123/taiwan-familymart-map" target="_blank" title="GitHub">
          <svg xmlns="http://www.w3.org/2000/svg" width="1.7rem" height="1.7rem" viewBox="0 0 32 32"><path fill="currentColor" fillRule="evenodd" d="M16 2a14 14 0 0 0-4.43 27.28c.7.13 1-.3 1-.67v-2.38c-3.89.84-4.71-1.88-4.71-1.88a3.71 3.71 0 0 0-1.62-2.05c-1.27-.86.1-.85.1-.85a2.94 2.94 0 0 1 2.14 1.45a3 3 0 0 0 4.08 1.16a2.93 2.93 0 0 1 .88-1.87c-3.1-.36-6.37-1.56-6.37-6.92a5.4 5.4 0 0 1 1.44-3.76a5 5 0 0 1 .14-3.7s1.17-.38 3.85 1.43a13.3 13.3 0 0 1 7 0c2.67-1.81 3.84-1.43 3.84-1.43a5 5 0 0 1 .14 3.7a5.4 5.4 0 0 1 1.44 3.76c0 5.38-3.27 6.56-6.39 6.91a3.33 3.33 0 0 1 .95 2.59v3.84c0 .46.25.81 1 .67A14 14 0 0 0 16 2Z"></path></svg>
        </a>
        <a class="footer__btn" href="https://minato1123.github.io/taiwan-711-mart-map/" target="_blank" title="7-11 地圖">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="m20.5 3l-.16.03L15 5.1L9 3L3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1l5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5M15 19l-6-2.11V5l6 2.11z"/></svg>
        </a>
      </div>
    </div>
    <div class="footer-time">
      資料最後更新時間：待確認
    </div>
    
  </footer>
</template>

<style scoped lang="scss">
  .footer-outer {
    background-color: rgb(var(--main-color));
    color: rgb(var(--white-color));
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    font-size: 0.8rem;
    padding: 1rem;

    .footer-right {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .footer-btns {
      display: flex;
      gap: 0.5rem;
    }

    .footer__btn {
      color: rgb(var(--white-color));
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s;
      
      &:hover {
        opacity: 0.8;
      }
    }
  }

  @media (max-width: 768px) {
    .footer-right {
      flex-direction: column;
    }
  }
</style>
<script setup lang="ts">
import MartMap from '../components/MartMap.vue'
import TheFilterMenu from '../components/TheFilterMenu.vue'
import InfoList from '../components/InfoList.vue'

</script>

<template>
  <div class="outer-container">
    <div class="nav-container">
      <a class="logo-container" href="/"><img class="nav-icon" src="familymart-icon.svg" alt=""><span class="nav-title">FamilyMart Map</span></a>
    </div>
    <main class="main-container">
      <TheFilterMenu class="menu-container" />
      <div class="mart-container">
        <MartMap class="map-container" />
        <InfoList class="info-container" />
      </div>
    </main>
  </div>
</template>

<style lang="scss" scoped>

.outer-container {
  width: 100vw;
  min-height: 98vh;
  margin-bottom: 3rem;
  overflow-x: hidden;

  .nav-container {
    width: 100%;
    height: 3rem;
    background-color: rgb(var(--main-color));
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 1rem;

    .logo-container {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 0.5rem;
      text-decoration: none;

      .nav-icon {
        height: 1.6rem;
      }
  
      .nav-title {
        color: rgb(var(--white-color));
        font-weight: 500;
        font-size: 1.4rem;
        
      }
    }
  }

  .main-container {
    display: flex;
    justify-content: center;
    box-sizing: border-box;
    margin: auto;
    gap: 1rem;

    .mart-container {
      width: 100%;
      .map-container {
        width: 100%;
        aspect-ratio: 1.8;
      }

      .info-container {
        margin-top: 1rem;
        width: 100%;

      }
    }

  }
}

@media screen and (min-width: 1271px) {
  .main-container {
    width: 70%;
  }
}

@media screen and (max-width: 1270px) {
  .main-container {
    width: 90%;
  }
}

@media screen and (min-width: 901px) {
  .menu-container {
    width: 16rem;
  }
}

@media screen and (max-width: 900px) {
  .main-container {
    width: 100%;
    flex-direction: column;
    padding: 0 0.5rem;

    .menu-container {
      width: 100%;
    }
  }
  
}
</style>
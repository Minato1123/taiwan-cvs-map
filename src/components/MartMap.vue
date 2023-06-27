<script setup lang="ts">
import 'leaflet/dist/leaflet.css'

const props = defineProps<{
  useMapElRef: () => Ref<HTMLElement | null>
}>()

const mapEl = props.useMapElRef()

</script>

<template>
  <div class="map" ref="mapEl" />
</template>
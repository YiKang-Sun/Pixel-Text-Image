<template>
  <div style="display: grid;place-items: center;width: 100vw;height: 100vh;background-color: white;">
    <PixelImage/>
  </div>
</template>

<script>
import PixelImage from './components/PixelImage.vue'

export default {
  name: 'App',
  components: {
    PixelImage
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>

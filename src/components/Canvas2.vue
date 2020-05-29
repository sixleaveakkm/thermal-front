<template>
  <div>
    <canvas ref="canvas" width="8" height="8" style="display: none"></canvas>
    <div style="height: 160px">
      <img :src="pic" alt="" width="160px" height="160px">
    </div>
    <p>Max Temperature: {{ maxTemp.toFixed(2) }}</p>
    <p>Min Temperature: {{ minTemp.toFixed(2) }}</p>
  </div>
</template>

<script lang="ts">
  import {Component, Prop, Vue, Watch} from 'vue-property-decorator';

  @Component
  export default class Canvas2 extends Vue {
    @Prop() protected data!: string;

    protected pic: string | undefined = "//:0";
    protected coolestTemp = 20;
    private hottestTemp = 40;
    protected maxTemp = 100;
    protected minTemp = 0;

    @Watch('data', { immediate: true, deep: true })
    onPixelsChange( data: string ) {
      const list: number[][] = JSON.parse(data)
      this.maxTemp = 0;
      this.minTemp = 100;
      const canvas = (this.$refs['canvas'] as HTMLCanvasElement | undefined)
      const ctx = canvas?.getContext('2d')
      if ( canvas == undefined || ctx == undefined ) {
        console.log("canvas is undefined")
        return
      }
      let i, j;
      for ( i = 0; i < 8; i++ ) {
        for ( j = 0; j < 8; j++ ) {
          const n = list[j][i]
          if ( n > this.maxTemp ) {
            this.maxTemp = n;
          }
          if ( n < this.minTemp ) {
            this.minTemp = n;
          }
          // hot 0 -> cool 210
          const value = 210 - (n - this.coolestTemp) / (this.hottestTemp - this.coolestTemp) * 210
          ctx.fillStyle = "hsl(" + value + ",100%, 50%)"
          ctx.fillRect(8 - j, i, 1, 1)
        }
      }
      this.pic = canvas.toDataURL();
    }

  }
</script>

<style scoped>
  .row {
    display: flex;
    justify-content: center;
  }

  .pixel {
    width: 10px;
    height: 10px;
    display: block;
  }
</style>

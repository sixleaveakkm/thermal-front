<template>
  <div>
    <div id="canvas">
      <div class="row" v-for="(rows, idx_row) in pixels" :key="idx_row">
        <div class="col" v-for="(color, idx_col) in rows" :key="idx_col">
          <div class="pixel" v-bind:style="{backgroundColor: color}"></div>
        </div>
      </div>
    </div>

    <p>Max Temperature: {{ maxTemp.toFixed(2) }}</p>
    <p>Min Temperature: {{ minTemp.toFixed(2) }}</p>
  </div>
</template>

<script lang="ts">
  import {Component, Prop, Vue, Watch} from 'vue-property-decorator';

  @Component
  export default class Canvas extends Vue {
    @Prop() protected data!: string;

    protected coolestTemp = 20;
    private hottestTemp = 40;
    protected maxTemp = 100;
    protected minTemp = 0;

    protected pixels: string[][] = [[]]

    @Watch('data', { immediate: true, deep: true })
    onPixelsChange( data: string ) {
      const list: number[][] = JSON.parse(data)
      this.maxTemp = 0;
      this.minTemp = 100;
      list.forEach(( row, i ) => {
        row.forEach(( n, j ) => {
          if ( n > this.maxTemp ) {
            this.maxTemp = n;
          }
          if ( n < this.minTemp ) {
            this.minTemp = n;
          }
          // hot 0 -> cool 210
          const value = 210 - (n - this.coolestTemp) / (this.hottestTemp - this.coolestTemp) * 210
          if ( this.pixels[j] === undefined ) {
            Vue.set(this.pixels, j, [])
          }
          Vue.set(this.pixels[j], i, "hsl(" + value + ",100%, 50%)")
        })
      })
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

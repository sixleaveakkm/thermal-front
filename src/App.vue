<template>
  <div id="app">
    <h3>Thermal Camera</h3>
    <Row>
      <Col span="4" offset="10">
        <Alert type="error" show-icon closable @on-close="setWebSocket">
          Connection Lost
          <span slot="close">Reconnect</span>
        </Alert>
      </Col>
    </Row>

    <Canvas2 :data="data"/>
  </div>
</template>

<script lang="ts">
  import {Alert, Col, Row} from "view-design"
  import {Component, Vue} from 'vue-property-decorator';
  import Canvas from './components/Canvas.vue';
  import Canvas2 from './components/Canvas2.vue';

  @Component({
    components: {
      Alert,
      Row,
      Col,
      Canvas,
      Canvas2,
    },
  })
  export default class App extends Vue {
    // language=JSON
    protected data = '[]';
    private intervalId: number | undefined;
    protected ws: WebSocket;

    public constructor() {
      super();
    }

    private setWebSocket() {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const that: App = this;
      this.ws = new WebSocket("ws://192.168.1.101:8102", "thermal-rs")

      this.ws.onopen = () => {
        console.log("Connection open")
        this.ws.send("Hello")
      }
      this.ws.onclose = function () {
        console.log("Connection closed.")
      }

      this.ws.onmessage = function ( evt ) {
        that.data = evt.data
      }
      this.ws.onerror = function () {
        setTimeout(that.setWebSocket, 1000)
      }
    }

    protected async created() {
      this.setWebSocket()
      this.intervalId = setInterval(this.fetchTemperatureData, 100)
    }

    protected async beforeDestory() {
      if ( this.intervalId !== undefined ) {
        clearInterval(this.intervalId)
      }
    }

    async fetchTemperatureData() {
      if ( this.ws?.readyState === WebSocket.OPEN ) {
        this.ws?.send("fetch")
      }
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
  margin-top: 60px;
}
</style>

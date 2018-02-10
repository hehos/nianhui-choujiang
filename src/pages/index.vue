<template>
  <div id="app">

    <el-menu
      class="top-menu"
      mode="horizontal"
      :router="router"
      background-color="transparent"
      text-color="#fff"
      active-text-color="#ffd04b">
      <el-menu-item index="jiaohuan">礼物交换</el-menu-item>
      <el-menu-item index="choujiang">抽奖</el-menu-item>
      <el-menu-item index="dianming">点名</el-menu-item>
    </el-menu>
    <div class="main_bg">
      <div class="main">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>

  export default {
    name: 'app',
    data() {
      return {
        activeIndex: 'jiaohuan',
        router: true
      }
    },
    created() {

    },
    mounted() {

    },
    methods: {

    },
    watch: {

    },

  }

</script>
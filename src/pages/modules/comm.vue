<template>
</template>

<script>

  export default {
    name: 'comm',
    data() {
      return {
      }
    },
    created() {

    },
    mounted() {
      // 获取总人数
      let getTotalTimer = setInterval(() => {
        if (window.nh_total_users
          && window.nh_total_users.length >= 0) {

          this.totalUsers = window.nh_total_users;
          this.useTotalUsers = Array.of(...this.totalUsers);
          console.log('this.totalUsers');
          console.log(this.totalUsers);
          // 初始化上次抽奖结果
          if (this.initStorageResult) {
            this.initStorageResult();
          }
          if (this.getTotalNames) {
            this.getTotalNames();
          }
          clearInterval(getTotalTimer);
        }
      }, 100)
    },
    methods: {
      numRand() {
        var rand = Math.floor((Math.random() * 1000000))
          % this.useTotalUsers.length;

        return rand;
//        console.log(rand);
//        console.log(this.results);
        // 老算法
//        if (this.results.includes(rand)) {
//          return this.numRand();
//        } else {
//          return rand;
//        }
      },

    },
    watch: {

    },

  }

</script>
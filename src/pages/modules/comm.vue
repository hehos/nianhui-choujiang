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
          clearInterval(getTotalTimer);
        }
      }, 100)
    },
    methods: {
      getRandUsers(num) {
        for (let i = 0; i < num; i++) {
          var rand = this.numRand();
          console.log(this.useTotalUsers[rand].id);
          this.results.push(this.useTotalUsers[rand].id);
          this.useTotalUsers.splice(rand, 1);
//          console.log(this.results);
        }
      },
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
<template>
  <div class="dm-wrap">

    <div class="setting">
      <div class="setting-title">每次点名人数</div>
      <el-input-number
        v-model="setNums"
        :min="1"
        size="small"
        :max="30"></el-input-number>
    </div>

    <div
      v-if="resultsShows <= 0"
      class="dm-result gun-user-result">
      <div
        v-for="(user, idx) in showNames"
        class="res-user gun-user">
        {{ user }}
      </div>
      <div class="zhunbei-text" v-if="showNames.length <= 0">亲，准备好了吗？</div>
    </div>

    <div
      v-if="!isBegin && resultsShows.length > 0"
      class="dm-result dm-result-info">
      <div
        v-for="(user, idx) in resultsShows"
        :key="idx"
        class="winning-item result-user">
        <img :src="user.headimgurl" alt="">
        <span class="name">{{ user.nickname }}</span>
      </div>
    </div>

    <div class="start-btn"
         @click="start">
      {{ btnText }}
    </div>
    <div class="restart-btn" @click="restart">重置点名</div>
  </div>
</template>

<script>
  import comm from './comm.vue';

  export default {
    name: 'dianming',
    extends: comm,
    data() {
      return {
        setNums: 1,
        totalUsers: [],
        useTotalUsers: [],
        totalNames: [],
        showNames: [],
        curIds: [],
        results: [],
        btnText: '开始点名',
        isBegin: false
      }
    },
    created() {

    },
    mounted() {
      console.log('dianming mounted')
    },
    computed: {
      resultsShows() {
        let resShows = [];
        this.results.forEach((id, i) => {
          let user = this.totalUsers.find((el) => {
            return id == el.id;
          })
          resShows.push(user);
        });
        console.log('resShows');
        console.log(resShows);
        return resShows;
      }
    },
    methods: {
      start() {
        if (this.totalUsers.length <= 0) {
          this.$message({
            showClose: true,
            message: '数据准备中，稍等！',
            type: 'warning'
          });
          return;
        }
        if (this.useTotalUsers.length < this.setNums) {
          this.$message({
            showClose: true,
            message: `还有${this.useTotalUsers.length}个小伙伴没被点名，
              请重置点名或减少每次点名的数量`,
            type: 'warning'
          });
          return;
        }

        this.isBegin = !this.isBegin;
        if (this.isBegin) {
          this.getTotalNames();
        }

        for (let i = 0; i < this.setNums; i++) {
          if (this.isBegin) {
            this.btnText = '停止点名';
            this.show(i);
          } else {
            this.btnText = '开始点名';
            clearInterval(this['dmTimer' + i]);
            this['dmTimer' + i] = null;
          }
        }

      },
      restart() {
        this.showNames = [];
        this.results = [];

        // 有总的用户时
        if (this.totalUsers > 0) {
          this.useTotalUsers = Array.of(...this.totalUsers);
        }
      },

      // 显示 名字变化效果。
      show(i) {
        this['dmTimer' + i] = setInterval(() => {
          var rand = this.numRand();
          this.showNames.splice(i, 1, this.totalNames[rand]);
          console.log(this.showNames);
        }, 50);
      },
      getTotalNames() {
        this.totalNames = [];
        this.useTotalUsers.forEach((el, i) => {
          this.totalNames.push(el.nickname);
        });
        console.log(this.totalNames);
      }
    },
    watch: {
      setNums(val) {
        console.log(val);
        this.restart();
      },
      isBegin(val) {
        if (val) {
          this.results = [];
        } else {
          // 点击停止后，随机取处理设置的每次点名人数出来
          this.results = [];
          this.getRandUsers(this.setNums);

//          this.curIds.forEach((id) => {
//            let delIdx = this.useTotalUsers.findIndex((el) => {
//              return id == el.id;
//            })
//            this.results.push(this.useTotalUsers[delIdx]);
//
//            // 去重
//            this.useTotalUsers.splice(delIdx, 1);
//          })
        }
      },
    },

  }

</script>
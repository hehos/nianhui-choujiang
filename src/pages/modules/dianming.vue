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
      v-if="curUsers.length <= 0"
      class="dm-result gun-user-result">
      <div
        v-for="(user, idx) in showNames"
        class="res-user gun-user">
        {{ user }}
      </div>
      <div class="zhunbei-text" v-if="showNames.length <= 0">亲，准备好了吗？</div>
    </div>

    <div
      v-if="!isBegin && curUsers.length > 0"
      class="dm-result dm-result-info">
      <div
        v-for="(user, idx) in curUsers"
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
        curUsers: [],
        btnText: '开始点名',
        isBegin: false
      }
    },
    created() {

    },
    mounted() {
      console.log('dianming mounted')
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
            message: '未点过的小伙伴少于每次点名的数量，' +
            '请重置点名或减少每次点名的数量',
            type: 'warning'
          });
          return;
        }

        this.isBegin = !this.isBegin;

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
        this.curUsers = [];
        this.curIds = [];
      },

      // 显示 名字变化效果。
      show(i) {
        this['dmTimer' + i] = setInterval(() => {
          var rand = this.numRand();
          this.showNames.splice(i, 1, this.useTotalUsers[rand]);
        }, 50);
      },
      getTotalNames() {
        this.totalUsers.forEach((el, i) => {
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
          this.curUsers = [];
        } else {
          // 点击停止后，随机取处理设置的每次点名人数出来
          var rand = this.numRand();
          console.log(this.useTotalUsers[rand].id);
          this.results.push(this.useTotalUsers[rand].id);
          this.useTotalUsers.splice(rand, 1);

          this.curIds.forEach((id) => {
            let delIdx = this.useTotalUsers.findIndex((el) => {
              return id == el.id;
            })
            this.curUsers.push(this.useTotalUsers[delIdx]);

            // 去重
            this.useTotalUsers.splice(delIdx, 1);
          })
        }
      },
    },

  }

</script>
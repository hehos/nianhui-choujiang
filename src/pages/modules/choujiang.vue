<template>
  <div class="cj-wrap">
    <div
      v-if="!isInitNum"
      class="setting">
      <div class="setting-title">
        设置每种奖项人数：
        </div>
      <div class="grades">
        <div class="grade-item">
          <div class="grade-item-title">十全十美奖</div>
          <el-input-number v-model="gradeNum1" size="small"
            :min="1" :max="30"></el-input-number>
        </div>
        <div class="grade-item">
          <div class="grade-item-title">八方来财奖</div>
          <el-input-number v-model="gradeNum2" size="small"
                           :min="1" :max="30"></el-input-number>
        </div>
        <div class="grade-item">
          <div class="grade-item-title">七星高照奖</div>
          <el-input-number v-model="gradeNum3" size="small"
                           :min="1" :max="30"></el-input-number>
        </div>
        <div class="grade-item">
          <div class="grade-item-title">五福临门奖</div>
          <el-input-number v-model="gradeNum4" size="small"
                           :min="1" :max="30"></el-input-number>
        </div>
        <div class="grade-item">
          <div class="grade-item-title">四季发财奖</div>
          <el-input-number v-model="gradeNum5" size="small"
                           :min="1" :max="30"></el-input-number>
        </div>
      </div>
    </div>

    <div class="cj-res-show result-box" style="color: #fffdfc;">
      <div class="grade-title-box">
        <div class="cj-res-grade-title">十全十美奖</div>
        <div class="cj-res-grade-title">八方来财奖</div>
        <div class="cj-res-grade-title">七星高照奖</div>
        <div class="cj-res-grade-title">五福临门奖</div>
        <div class="cj-res-grade-title">四季发财奖</div>
      </div>
      <div class="grade-box">
        <div
          v-for="(grade, idx) in resultsShow"
          :key="idx"
          class="res-grade">
          <div class="grade-users">
            <div
              v-for="(user, idx) in grade"
              :key="idx"
              class="winning-item result-user">
              <img :src="user.headimgurl" alt="">
              <span class="name">{{ user.nickname }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!--<div class="num_mask"></div>-->
    <!--<div class="num_box">-->
      <!--<div class="num"></div>-->
      <!--<div class="num"></div>-->
      <!--<div class="num"></div>-->
    <!--</div>-->
    <div class="start-btn" :class="isEnd ? 'disabled': ''"
         @click="start">
      {{ isEnd ? '抽奖结束' : '开始抽奖' }}
    </div>
    <div class="restart-btn" @click="restart">重新抽奖</div>
  </div>
</template>

<script>
  import util from '../../util';
  import comm from './comm.vue';
  let ls = util.Storage.version(1).init().update();

  export default {
    name: 'choujiang',
    extends: comm,
    data() {
      return {
        grade: 5,
        curGrade: 5,
        gradeNum1: 2,
        gradeNum2: 3,
        gradeNum3: 5,
        gradeNum4: 8,
        gradeNum5: 10,
        totalNum: 0,
        isEnd: false,
        isBegin: false,
        isInitNum: false,
        results: [],
        resultsShow: [],
        storageKey: 'cj_results',
        totalUsers: [],
        useTotalUsers: [],
      }
    },
    created() {
      // 初始化一共抽奖次数
      this.countTotalNum();

        let storageKey =
        nh_storage.createKey(this.storageKey);
      this.resStorageKey = storageKey;

      this.initResultsShow();

    },

    mounted() {
      console.log('choujiang mounted')
    },
    methods: {

      initStorageResult() {
        let results = nh_storage.getItem(this.resStorageKey);
        if (results) {
          this.results = results.results;
          this.curGrade = results.curGrade;
          if (this.results.length >= this.totalNum) {
            this.isEnd = true;
            this.isInitNum = true;
          }
          this.showResult();
        }

      },

      start() {
        if (this.totalUsers.length <= 0) {
          this.$message({
            showClose: true,
            message: '数据准备中，稍等！',
            type: 'warning'
          });
          return;
        }

        var that = this;
        var u = 265;
        // 首先获取一共抽奖人数
        this.countTotalNum();

        let userNum = this['gradeNum' + this.curGrade];

//        console.log('userNum');
//        console.log(userNum);

        if (this.isBegin) return false;
        this.isBegin = true;
        // 初始化各个奖项人数之后不能再设置，除非重新抽奖
        this.isInitNum = true;

        this.getRandUsers(userNum);

//        console.log('this.results');
//        console.log(this.results);

        if(that.results.length >= that.totalNum) {
          that.isEnd = true;
        }

        // 调整需求
        that.isBegin = false;
        that.showResult();

        this.curGrade--;

        nh_storage.setItem(this.resStorageKey, {
          curGrade: this.curGrade,
          results: that.results
        });
//        var resultStr = result + '';
//        resultStr = resultStr.padStart(3, '0');
//        var num_arr = resultStr.split('');
//        $(".num").each(function (index) {
//          var _num = $(this);
//          setTimeout(function () {
//            _num.animate({
//              backgroundPositionY: (u * 60) - (u * num_arr[index])
//            }, {
//              duration: 1000 + index * 1000,
//              easing: "easeInOutCirc",
//              complete: function () {
//                if (index === num_arr.length - 1) {
//                  that.isBegin = false;
//                  that.showResult();
//                  nh_storage.setItem(this.resStorageKey, that.results);
//                  if(that.results.length >= that.totalNum) {
//                    that.isEnd = true;
//                  }
//                }
//              }
//            });
//          }, index * 10);
//        });

      },
      rmUser(index) {
        this.useTotalUsers.splice(index, 1);
      },
      showResult() {
        this.initResultsShow();

        this.results.forEach((id, i) => {
          let winningUser = this.totalUsers.find((el) => {
            return id == el.id;
          })
          if (this.resultsShow[4].length < this.gradeNum5) {
            this.resultsShow[4].push(winningUser);
          } else if (this.resultsShow[3].length < this.gradeNum4) {
            this.resultsShow[3].push(winningUser);
          } else if (this.resultsShow[2].length < this.gradeNum3) {
            this.resultsShow[2].push(winningUser);
          }else if (this.resultsShow[1].length < this.gradeNum2) {
            this.resultsShow[1].push(winningUser);
          } else {
            this.resultsShow[0].push(winningUser);
          }
        });

//        console.log('中奖得人：');
//        console.log(this.resultsShow);
      },

      initResultsShow() {
        this.resultsShow = [[], [], [], [], []];
      },

      restart() {
        this.curGrade = this.grade;
        this.initResultsShow();
        console.log(this.resultsShow);
        this.results = [];
        this.isInitNum = false;
        this.isEnd = false;
        nh_storage.setItem(this.resStorageKey, '');
      },

      countTotalNum() {
        this.totalNum = 0;
        for (let i = 0; i < this.grade; i++) {
//          console.log(this['gradeNum' + (i+1)]);
          this.totalNum += this['gradeNum' + (i+1)];
        }
//        console.log(this.totalNum);
      }
    },
    watch: {
    },

  }

</script>

<style>


</style>
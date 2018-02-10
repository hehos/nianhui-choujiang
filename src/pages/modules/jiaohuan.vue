<template>
  <div class="jh-wrap">

    <div class="jh-title">交换结果</div>

    <div
      class="setting">
      <div class="setting-title">每次交换人数</div>
      <el-select
        @change="changeEvent"
        v-model="everyNum"
        placeholder="">
        <el-option
          v-for="item in numOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </div>

    <div class="result-box">
      <div
        v-for="userStepGroup in resultsFormat"
        :key="userStepGroup.step"
        class="res-step-item">
        <div class="step-title">第 {{ userStepGroup.step }} 轮结果</div>
        <div
          v-for="(userGroup, gIdx) in userStepGroup.resStepAry"
          :key="gIdx"
          class="result-item">
          <div
            v-for="user in userGroup"
            :key="user.id"
            class="result-user">
            <img :src="user.headimgurl" alt="">
            <span class="name">{{ user.nickname }}</span>
          </div>
        </div>
      </div>


    </div>

    <div class="start-btn" :class="isEnd ? 'disabled': ''"
         @click="start">
      {{ isEnd ? '交换完毕' : '第 ' + swapStep + ' 轮交换' }}
    </div>
    <div class="restart-btn" @click="restart">从新交换</div>
  </div>
</template>

<script>
  import comm from './comm.vue';

  export default {
    name: 'jiaohuan',
    extends: comm,
    data() {
      return {
        isEnd: false,
        selectNum: 6, // 每次交换礼物人数基数
        everyNum: 6,  // 每次交换礼物人数
        numOptions: [],
        results: [],
        storageKey: 'jh_results',
        swapStep: 1
      }
    },
    created() {
      let storageKey =
        nh_storage.createKey(this.storageKey);
      this.resStorageKey = storageKey;

      for (let i = 0; i < 5; i++) {
        let num = this.selectNum * (i + 1);
        this.numOptions.push({
          value: num,
          label: `${num}人次`
        });
      }
    },
    mounted() {
      console.log('jiaohuan mounted')
    },
    methods: {

      initStorageResult() {
        let results = nh_storage.getItem(this.resStorageKey);
        if (results) {
          this.results = results.results;
          this.swapStep = results.swapStep;
          this.everyNum = results.everyNum;
        }
      },

      start() {

        nh_axios.get(`${window.nh_domain}/read.php`, {
          params: {
            nums: this.everyNum
          }
        })
          .then((res) => {
            console.log(res.data);
            let data = res.data;
            if (data.length <= 0) {
              this.$message({
                showClose: true,
                message: '没有小伙伴了',
                type: 'warning'
              });
              this.isEnd = true;
              return;
            }
            this.swapStep++;
            this.results.push(...data);
            console.log(this.results)
            nh_storage.setItem(this.resStorageKey, {
              everyNum: this.everyNum,
              swapStep: this.swapStep,
              results: this.results
            });
          })
          .catch(function (error) {
            alert('获取数据失败');
          });
      },

      restart() {
        this.isInitNum = false;
        this.isEnd = false;
        this.swapStep = 1;
        this.resultsFormat = [];
        this.results = [];
        nh_storage.setItem(this.resStorageKey, '');
        nh_axios.get(`${window.nh_domain}/read.php`, {
          params: {
            reset: 9
          }
        })
          .then(function (res) {
            console.log(res)
          })
          .catch(function (error) {
            alert('获取数据失败');
          });
      },

      changeEvent() {
        console.log('changeEvent');
        this.restart();
      }
    },
    watch: {

    },
    computed: {
      resultsFormat() {
        let resultsFormat = [];
        let resStepAry = [];
        let resGroup = [];
        this.results.forEach((el, i) => {
          if (resGroup.length >= 2) {
            resStepAry.push(resGroup);
            resGroup = [];
          }
          resGroup.push(el);

          if (i !== 0 && i % this.everyNum === 0) {
            console.log(resStepAry);
            resultsFormat.push({
              step: i / this.everyNum,
              resStepAry: resStepAry
            })
            resStepAry = [];
          }
        });
        if (resGroup.length > 0) {
          resStepAry.push(resGroup);
          resultsFormat.push({
            step: this.swapStep - 1,
            resStepAry: resStepAry
          })
        }

        return resultsFormat;
      }
    }

  }

</script>
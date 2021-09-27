 <template>
 <form action="#" @submit.prevent="onSubmit">
    <p v-if="errorsPresent" class="error">Please fill out both fields!</p>


    <div class="ui labeled input fluid">
      <div class="ui label">
        <i class="calendar plus icon"></i> Title
      </div>
      <input type="text" placeholder="Enter title..." v-model="recurring.title" />
    </div>

    <div class="ui labeled input fluid">
      <div class="ui label">
        <i class="info circle icon"></i> Amount
      </div>
      <input type="number" step=".01" placeholder="Enter amount" v-model="recurring.amount" />
    </div>

    <div class="ui labeled input fluid">
      <div class="ui label">
        <i class="info circle icon"></i> Start date
      </div>
      <input type="datetime-local" v-model="recurring.startdate" />
    </div>

    <div class="ui labeled input fluid">
      <div class="ui label">
        <i class="info circle icon"></i> Ended
      </div>
      <input type="checkbox" v-model="recurring.ended" />
    </div>

    <div class="ui labeled input fluid">
      <div class="ui label">
        <i class="info circle icon"></i> End date
      </div>
      <input type="datetime-local" v-model="recurring.enddate" />
    </div>

    <div class="ui labeled input fluid">
      <div class="ui label">
        <i class="info circle icon"></i> Period
      </div>
      <input type="number" placeholder="Enter period" v-model="recurring.period" />
    </div>

    <div class="ui labeled input fluid">
      <div class="ui label">
        <i class="info circle icon"></i> Period Type
      </div>
      <select v-model="recurring.periodType">
          <option value="day">Day</option>
          <option value="week">Week</option>
          <option value="month">Month</option>
          <option value="year">Year</option>
        </select>
    </div>

    <button class="positive ui button">Submit</button>
  </form>
</template>

<script>
export default {
  name: 'recurring-form',
  props: {
    recurring: {
      type: Object,
      required: false,
      default: () => {
        return {
          title: '',
          amount: 0,
          startdate: new Date(Date.parse("2021-09-15T00:00")),
          ended: false,
          enddate: null,
          period: 0,
          periodType: "day"
        };
      }
    }
  },
  data() {
    return {
      errorsPresent: false
    };
  },
  methods: {
    onSubmit: function() {
      // if (this.task.task1 === '' || this.task.task2 === '') {
      //   this.errorsPresent = true;
      // } else {
      this.$emit('createOrUpdate', this.recurring);
      // }
    }
  }
};
</script>

<style scoped>
.error {
  color: red;
}
</style>
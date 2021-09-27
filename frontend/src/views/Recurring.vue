 <template>
  <div>
    <h1>Recurring</h1> <span><router-link to="/recurring/new" class="item">
            <i class="plus circle icon"></i> New
          </router-link> </span>
    <table id="tasks" class="ui celled compact table">
      <thead>
        <tr>
          <th> <i class="braille icon"></i> Title</th>
          <th> <i class="euro sign icon"></i> Amount</th>
          <th> <i class="hourglass icon"></i> Due</th>
          <!-- <th> <i class="calendar plus icon"></i>startdate</th> -->
          <!-- <th> <i class="calendar times icon"></i>enddate</th> -->
          <!-- <th> <i class="stopwatch icon"></i>period</th>
          <th> <i class="hourglass icon"></i>periodType</th> -->
          <th> <i class="lock open icon"></i></th>
          <th> <i class="edit icon"></i></th>
          <th> <i class="trash icon"></i></th>
        </tr>
      </thead>
      <tr v-for="(recurring, i) in recurringList" :key="i">
        <td>{{ recurring.title }}</td>
        <td>{{ recurring.amount }} € every {{ recurring.period }} {{ recurring.periodType }} = {{ (recurring.velocity * 60*60).toFixed(6) }} €/h</td>
        <td>{{ recurring.secondsDue }}</td>
        <!-- <td>{{ recurring.enddate }}</td> -->
        <!-- <td>{{ recurring.period }}</td>
        <td>{{ recurring.periodType }}</td> -->
        <td width="75" class="center aligned">
          <router-link :to="{ name: 'show', params: { id: recurring._id }}">Show</router-link>
        </td>
        <td width="75" class="center aligned">
          <router-link :to="{ name: 'edit', params: { id: recurring._id }}">Edit</router-link>
        </td>
        <td width="75" class="center aligned" @click.prevent="onDestroy(recurring._id)">
          <a :href="`/recurring/${recurring._id}`">Delete</a>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import { api } from '../helpers/helpers';
export default {
  name: 'recurring',
  data() {
    return {
      recurringList: []
    };
  },
  methods: {
    async onDestroy(id) {
      const sure = window.confirm('Are you sure?');
      if (!sure) return;
      await api.deleterecurring(id);
      this.flash('recurring deleted sucessfully!', 'success');
      const newRecurringList = this.recurringList.filter(recurring => recurring._id !== id);
      this.recurringList = newRecurringList;
    },
    setTotal (total) {
      this.total = total
    },
    setCredit (credit) {
      this.credit = credit
      this.$emit('newCredit', this.credit)
    },
    setSalaryDue (salaryDue) {
      this.salaryDue = salaryDue
      this.$emit('newSalaryDue', this.salaryDue)
    },
    setRecurringBalance(recurringBalance) {
      this.recurringBalance = recurringBalance
      this.$emit('newRecurringBalance', this.recurringBalance)
    },
    sortBySecondsDue( a, b ) {
      if ( a.secondsDue < b.secondsDue ){
        return -1;
      }
      if ( a.secondsDue > b.secondsDue ){
        return 1;
      }
      return 0;
    },
    calcBalance: function(recurring) {
      var startdate = new Date(Date.parse(recurring.startdate))
      var enddate = new Date()
      if (startdate < this.appStartdate){
        startdate = this.appStartdate
      }
      if (recurring.ended) {
        enddate = new Date(Date.parse(recurring.enddate))
      }
      return ((enddate - startdate) / 1000) * recurring.velocity
    },
    setBalance: function(recurring, balance) {
      // var startdate = new Date(Date.parse(recurring.startdate))
      // var enddate = new Date()
      // if (startdate < this.appStartdate){
      //   startdate = this.appStartdate
      // }
      // if (recurring.ended) {
      //   enddate = new Date(Date.parse(recurring.enddate))
      // }
      recurring.balance = balance //((enddate - startdate) / 1000) * recurring.velocity
    },
    setVelocity: function(recurring) {
      //var startdate = new Date(Date.parse(recurring.startdate))
      //var now = new Date()
      var multiplier = 1
      var length = 1
      if (recurring.periodType == 'month'){
        multiplier = 12
        length = 1000*60*60*24*365 * recurring.period
      }
      else if (recurring.periodType == 'day') {
        length = 1000*60*60*24 * recurring.period
      }
      else if (recurring.periodType == 'week') {
        length = 1000*60*60*24*7 * recurring.period
      }
      else if (recurring.periodType == 'year') {
        length = 1000*60*60*24*365 * recurring.period
      }
      var velocity = (recurring.amount * multiplier) / (length / 1000)
      recurring.velocity = velocity
    },
    setDueSeconds: function(recurring, now) {
      var startdate = new Date(Date.parse(recurring.startdate))
      //var now = new Date()
      var secondsDue = 0
      var length = 1
      var elapsed = 1
      if (recurring.periodType == 'month') {
        if (recurring.period == 1)
        {
          var sdThisMonth = new Date(now.getFullYear(), now.getMonth(), startdate.getDate(), startdate.getHours(), startdate.getMinutes(), startdate.getSeconds(), startdate.getMilliseconds())
          if (sdThisMonth < now) {
            var sdNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, startdate.getDate(), startdate.getHours(), startdate.getMinutes(), startdate.getSeconds(), startdate.getMilliseconds())
            length = sdNextMonth.getTime() - sdThisMonth.getTime()
            elapsed = now.getTime() - sdThisMonth.getTime()
          }
          else {
            var sdPreviousMonth = new Date(now.getFullYear(), now.getMonth() - 1, startdate.getDate(), startdate.getHours(), startdate.getMinutes(), startdate.getSeconds(), startdate.getMilliseconds())
            length = sdThisMonth.getTime() - sdPreviousMonth.getTime()
            elapsed = now.getTime() - sdPreviousMonth.getTime()
          }
          secondsDue = (length - elapsed) / 1000
        }
        else {
          var refDate = new Date(startdate.getFullYear(), startdate.getMonth(), startdate.getDate(), startdate.getHours(), startdate.getMinutes(), startdate.getSeconds(), startdate.getMilliseconds())
          while (now > refDate) {
            refDate = new Date(refDate.getFullYear(), refDate.getMonth() + recurring.period, refDate.getDate(), refDate.getHours(), refDate.getMinutes(), refDate.getSeconds(), refDate.getMilliseconds())
          }
          var refSec = refDate.getTime()
          nowSec = now.getTime()
          secondsDue = (refSec - nowSec) / 1000
        }
      }
      else if (recurring.periodType == "week" || recurring.periodType == "year" || recurring.periodType == "day") {
        if (recurring.periodType == "week") {
          length = 1000*60*60*24*7 * recurring.period
        }
        else if (recurring.periodType == "year") {
          length = 1000*60*60*24*365 * recurring.period
        }
        else if (recurring.periodType == "day") {
          length = 1000*60*60*24 * recurring.period
        }
        var sdSec = startdate.getTime()
        var nowSec = now.getTime()
        var diff = nowSec - sdSec
        var n = parseInt(diff / length)
        var next = sdSec + ((n+1) * length)
        secondsDue = (next - nowSec) / 1000
      }
      recurring.secondsDue = secondsDue
      // var d = Math.floor(secondsDue / (3600*24));
      // var h = Math.floor(secondsDue % (3600*24) / 3600);
      // var m = Math.floor(secondsDue % 3600 / 60);
      // var s = Math.floor(secondsDue % 60);

      // var dDisplay = d > 0 ? d + (d == 1 ? " day " : " days ") : "";
      // var hDisplay = h > 0 ? h + (h == 1 ? " hour" : " hours") : "";
      // // var mDisplay = m > 0 ? m + (m == 1 ? ":" : ":") : "";
      // // var sDisplay = s > 0 ? s + (s == 1 ? "" : "") : "";
      // return dDisplay + hDisplay
    },
  },
  async mounted() {
    var rl = await api.getrecurringList();

    var now = new Date()
        
    var total = 0
    var credit = 0
    
    var lookForCredit = true

    var balance = 0

    for (var r of rl) {
      this.setVelocity(r)
      total += r.velocity
      this.setDueSeconds(r, now)
      var rBalance = this.calcBalance(r)
      this.setBalance(r, rBalance)
      balance += r.balance
    }
    this.setTotal(total)
    this.setRecurringBalance(balance)
    
    var sorted = rl.sort(this.sortBySecondsDue)
    //sorted = sorted.filter(item => (item.ended));
    //console.log(sorted)

    // eslint-disable-next-line no-unused-vars
    var salaryDue = 0
    for (var rSorted of sorted) {
      if (lookForCredit) {
        if (rSorted.amount < 0) {
          credit += r.amount
        }
        else {
          lookForCredit = false
          salaryDue = rSorted.secondsDue
        }
      }
    }
    this.setCredit(credit)
    this.recurringList = sorted
  }
};
</script>
 <template>
  <div class="col-xs-12">
    <h4>Recurring {{ this.myRecurringList.length }}
    <RecurringForm 
      v-bind:new="true"
      v-bind:accountId="account._id"
      @newRecurring='addRecurring'
    > 
    </RecurringForm><input type="checkbox" v-model="showAll"/></h4>
    <!-- <ul>
      <Recurring
        v-for="recurring in myRecurringList"
        v-bind:key="recurring._id"
        :recurring="recurring"
        :account="account"
        @removeRecurring='removeRecurring'
        @editedRecurring='editRecurring'
      />
    </ul> -->
    <div class="container grid-striped">
      <div class="row" style="font-weight: bold">
        <div class="col-xs-3 col-md-1">V €/h</div>
        <div class="col-xs-5 col-md-3">Description</div>
        <div class="col-xs-4 col-md-1">Due in</div>
        <div class="col-xs-2 col-md-1">Balance</div>
        <div class="col-xs-2 col-md-1"></div>
        <div class="col-xs-2 col-md-1"></div>
        <div class="col-xs-3 col-md-2"></div>
        <div class="col-xs-3 col-md-2"></div>
      </div>
      <Recurring
        v-for="recurring in myRecurringList"
        v-bind:key="recurring._id"
        :showAll="showAll"
        :recurring="recurring"
        :account="account"
        @removeRecurring='removeRecurring'
        @editedRecurring='editRecurring'
      />
    </div>
  </div>
</template>

<script>

import RecurringForm from '../components/RecurringForm.vue'
import Recurring from '../components/Recurring.vue'
import RecurringBudgetsMethods from "../helpers/recurringBudgetsMethods"
export default {
  name: 'recurringList',
  mixins: [RecurringBudgetsMethods],
  components: {
    RecurringForm,
    Recurring
  },
  props: ["recurringList", "account"],
  data() {
    return {
      myRecurringList: this.recurringList,
      showAll: false
    };
  },
  methods: {
    addRecurring (newRecurring) {
      var now = new Date()
      this.updateItem(newRecurring, now)
      this.myRecurringList.push(newRecurring)
    },
    async removeRecurring (recurringToRemove) {
      let response = await this.$http.delete(`/user/account/${this.account._id}/recurring/${recurringToRemove._id}`);
      this.myRecurringList = this.myRecurringList.filter((recurring) => {
        return response.data.deletedRecurringId != recurring._id
      })
    },
    async editRecurring (editedRecurringId, editedRecurring) {
      await this.$http.put(`/user/account/${this.account._id}/recurring/${editedRecurringId}`, editedRecurring);
    }
  },
  watch: {
    recurringList: function(newVal) {
      this.myRecurringList = newVal
    }
  },
  mounted() {
    //console.log(this.accountList)
  }
};
</script>

<style scoped>
.grid-striped .row:nth-of-type(odd) {
    background-color: rgba(0,0,0,.15);
}

.row {
    padding:5px;
}
</style>

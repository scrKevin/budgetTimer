 <template>
  <div>
    <h4>Budgets {{ this.myBudgetList.length }}
    <BudgetForm 
      v-bind:new="true"
      v-bind:accountId="account._id"
      @newBudget='addBudget'
    > 
    </BudgetForm></h4>
    <!-- <ul>
      <Budget
        v-for="budget in myBudgetList"
        v-bind:key="budget._id"
        :budget="budget"
        :account="account"
        @removeBudget='removeBudget'
        @editedBudget='editBudget'
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
      <Budget
        v-for="budget in myBudgetList"
        v-bind:key="budget._id"
        :budget="budget"
        :account="account"
        @removeBudget='removeBudget'
        @editedBudget='editBudget'
        @budgetUpdated='updateBudget'
      />
    </div>
  </div>
</template>

<script>

import BudgetForm from '../components/BudgetForm.vue'
import Budget from '../components/Budget.vue'
import RecurringBudgetsMethods from "../helpers/recurringBudgetsMethods"
export default {
  name: 'budgetList',
  mixins: [RecurringBudgetsMethods],
  components: {
    BudgetForm,
    Budget
  },
  props: ["budgetList", "account"],
  data() {
    return {
      myBudgetList: this.budgetList
    };
  },
  methods: {
    updateBudget (budgetToUpdate) {
      var now = new Date()
      this.updateItem(budgetToUpdate, now)
      this.$emit("budgetUpdated")
    },
    addBudget (newBudget) {
      var now = new Date()
      this.updateItem(newBudget, now)
      this.myBudgetList.push(newBudget)
    },
    async removeBudget (budgetToRemove) {
      let response = await this.$http.delete(`/user/account/${this.account._id}/budgets/${budgetToRemove._id}`);
      this.myBudgetList = this.myBudgetList.filter((budget) => {
        return response.data.deletedBudgetId != budget._id
      })
    },
    async editBudget (editedBudgetId, editedBudget) {
      await this.$http.put(`/user/account/${this.account._id}/budgets/${editedBudgetId}`, editedBudget);
    },
  },
  watch: {
    budgetList: function(newVal) {
      this.myBudgetList = newVal
    }
  },
  mounted() {
    //console.log(this.accountList)
  }
};
</script>

<style scoped>
.grid-striped .row:nth-of-type(odd) {
    background-color: rgba(2, 0, 130, 0.15);
}

.row {
    padding:5px;
}
</style>
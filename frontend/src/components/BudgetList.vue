 <template>
  <div>
    <h2>Budgets {{ this.myBudgetList.length }}
    <BudgetForm 
      v-bind:new="true"
      v-bind:accountId="account._id"
      @newBudget='addBudget'
    > 
    </BudgetForm></h2>
    <ul>
      <Budget
        v-for="budget in myBudgetList"
        v-bind:key="budget._id"
        :budget="budget"
        :account="account"
        @removeBudget='removeBudget'
        @editedBudget='editBudget'
      />
    </ul>
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
    }
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
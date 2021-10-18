 <template>
  <div>
    <h2>Recurring {{ this.myRecurringList.length }}
    <RecurringForm 
      v-bind:new="true"
      v-bind:accountId="account._id"
      @newRecurring='addRecurring'
    > 
    </RecurringForm></h2>
    <ul>
      <Recurring
        v-for="recurring in myRecurringList"
        v-bind:key="recurring._id"
        :recurring="recurring"
        :account="account"
        @removeRecurring='removeRecurring'
        @editedRecurring='editRecurring'
      />
    </ul>
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
      myRecurringList: this.recurringList
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
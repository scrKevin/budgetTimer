 <template>
 <div>
    <div>
      <h1>Accounts {{ this.myAccountList.length }}
      <AccountForm 
        v-bind:new="true"
        @newAccount='addAccount'
      > 
      </AccountForm></h1>
    </div>
    <ul>
      <Account
        v-for="account in myAccountList"
        v-bind:key="account._id"
        :account="account"
        @removedAccount='removeAccount'
        @editedAccount='editAccount'
      />
      </ul>
  </div>
</template>

<script>

import AccountForm from '../components/AccountForm.vue'
import Account from '../components/Account.vue'
export default {
  name: 'accountList',
  components: {
    AccountForm,
    Account
  },
  props: ["accountList"],
  data() {
    return {
      myAccountList: this.accountList
    };
  },
  methods: {
    addAccount (newAccount) {
      this.myAccountList.push(newAccount)
    },
    removeAccount (accountId) {
      this.myAccountList = this.myAccountList.filter((account) => {
        return account._id != accountId
      })
    },
    editAccount (accountId, data) {
      console.log(accountId)
      console.log(data)
      // for (let account of this.myAccountList)
      // {
      //   if (account._id == accountId)
      //   {
      //     account.name = data.name
      //     account.startbalance = data.startbalance
      //   }
      // }
    }
  },
  watch: {
    accountList: function(newVal) {
      this.myAccountList = newVal
    }
  },
  mounted() {
    //console.log(this.accountList)
  }
};
</script>
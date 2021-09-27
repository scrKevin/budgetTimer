 <template>
  <div>
    <h1>Show Recurring</h1>

   
    <div class="ui labeled input fluid">
      <div class="ui label">
      <i class="tasks icon"></i>  Title
      </div>
      <input type="text" readonly  :value="recurring.title"/>
    </div>

     <div class="ui labeled input fluid">
      <div class="ui label">
        <i class="info circle icon"></i> Amount
      </div>
      <input type="text" readonly  :value="recurring.amount"/>
    </div>
    
    <div class="actions">
      <router-link :to="{ name: 'edit', params: { id: this.$route.params.id }}">
        Edit recurring
      </router-link>
    </div>
  </div>
</template>

<script>
import { api } from '../helpers/helpers';
export default {
  name: 'show',
  data() {
    return {
      recurring: ''
    };
  },
  async mounted() {
    this.recurring = await api.getrecurring(this.$route.params.id);
  }
};
</script>

<style scoped>
.actions a {
  display: block;
  text-decoration: underline;
  margin: 20px 10px;
}
</style>
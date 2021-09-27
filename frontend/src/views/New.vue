 <template>
  <div>
    <h1>New task</h1>
    <Recurringform @createOrUpdate="createOrUpdate"></Recurringform>
  </div>
</template>

<script>
import Recurringform from '../components/Recurringform.vue';
import { api } from '../helpers/helpers';
export default {
  name: 'new-recurring',
  components: {
    Recurringform
  },
  methods: {
    createOrUpdate: async function(recurring) {
      const res = await api.createrecurring(recurring);
      this.flash('recurring created', 'success');
      this.$router.push(`/recurring/${res._id}`);
    }
  }
};
</script>
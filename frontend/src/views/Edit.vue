<template>
  <div>
    <h1>Edit recurring</h1>
    <Recurringform @createOrUpdate="createOrUpdate" :recurring=this.recurring></Recurringform>
  </div>
</template>

<script>
import Recurringform from '../components/Recurringform.vue';
import { api } from '../helpers/helpers';

export default {
  name: 'edit',
  components: {
    Recurringform
  },
  data: function() {
    return {
      recurring: {}
    };
  },
  methods: {
    createOrUpdate: async function(recurring) {
      await api.updaterecurring(recurring);
      this.flash('recurring updated sucessfully!', 'success');
      this.$router.push(`/recurring/${recurring._id}`);
    }
  },
  async mounted() {
    this.recurring = await api.getrecurring(this.$route.params.id);
  }
};
</script>
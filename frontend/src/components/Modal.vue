<template>
  <span>
    <b-modal v-model="showModal" @hide="close()" title="">
      
      <section class="modal-title">
        <slot name="header">
          This is the default header!
        </slot>
       </section>
      
      <section class="modal-body">
        <slot name="body">
          This is the default body!
        </slot>
       </section>
    </b-modal>
  </span>
</template>

<script>
  export default {
    name: 'Modal',
    props: ['id', "isModalVisible"],
    data () {
      return {
        showModal: this.isModalVisible,
      }
    },
    methods: {
      close() {
        this.$emit('close');
      },
    },
    watch: {
      isModalVisible: function (newVal) {
        this.showModal = newVal
      }
    }
  }
</script>

<style>
.modal-backdrop {
  opacity: 0.3;
}
</style>
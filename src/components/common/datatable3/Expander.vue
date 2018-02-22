<template>
  <span :style="style" @click="onClick">
    <i class="fa" :class="value ? 'fa-caret-down' : 'fa-caret-right'"></i>
  </span>
</template>

<script>
  export default {
    props: {
      value: {
        type: Boolean,
        default: false
      },
      style: {
        type: Object,
        default () { return {} }
      }
    },
    methods: {
      onClick () {
        this.$emit('click')
      }
    }
  }
</script>

<style scoped>
  span {
    display: table;
    width: 100%;
    height: 100%;
    cursor: pointer;
  }
</style>
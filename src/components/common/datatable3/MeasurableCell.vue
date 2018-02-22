<template>
  <td class="no-padding no-border" :style="style"></td>
</template>

<script>
  import { pixelize } from './util'

  export default {
    props: {
      height: {
        type: Number,
        default: 0
      }
    },
    computed: {
      style () {
        return {
          height: pixelize(this.height),
          width: '1px'
        }
      }
    }
  }
</script>

<style>
  .no-padding {
    padding: 0;
  }
  .no-border {
    border: 0;
  }
</style>
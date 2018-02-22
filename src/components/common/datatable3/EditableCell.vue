<template>
  <div :style="style">
    <span>
      <el-popover placement="right" trigger="manual" :width="popoverWidth" v-model="showPopup">
        <i class="fa fa-edit" slot="reference" @click="showPopup = !showPopup"></i>
        <div>
          <popup-content :render-content="renderEditor"/>
          <a href="#" class="pull-right" @click.prevent="showPopup = false">Close</a>
        </div>
      </el-popover>
    </span>
    {{ displayText }}
  </div>
</template>

<script>
  import { Popover } from 'element-ui'
  import PopupContent from './PopupContent'

  export default {
    components: {
      [Popover.name]: Popover,
      PopupContent
    },
    props: {
      displayText: {
        type: String,
        default: ''
      },
      renderEditor: {
        type: Function,
        required: true
      },
      popoverWidth: {
        type: Number,
        default: 230
      }
    },
    data () {
      return {
        showPopup: false
      }
    },
    computed: {
      style () {
        return {
          width: '100%',
          padding: '2px 5px',
          overflow: 'hidden',
          'white-space': 'no-wrap',
          'text-overflow': 'ellipsis'
        }
      }
    },
    created () {
      console.log('created')
    }
  }
</script>

<style scoped>
  .fa.fa-edit {
    cursor: pointer;
  }
</style>
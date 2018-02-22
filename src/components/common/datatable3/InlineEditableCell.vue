<template>
  <div @dblclick="onDoubleClicked" style="cursor: pointer;">
    <div v-if="!showTextInput" :style="readOnlyCellStyle">
      <el-popover placement="right" v-model="showPopup">
        <!-- <i class="fa fa-edit" slot="reference" @click="onEditIconClicked"></i> -->
        <div slot="reference">
        </div>
        <div>
          <inline-select v-if="type === 'single-select'" v-model="input" :options="options"/>
          <inline-select v-else-if="type === 'multi-select'" v-model="input" :options="options" :is-multiple="true"/>
          <textarea v-else-if="type === 'textarea'" v-model="input" rows="5" cols="30"></textarea>
        </div>
      </el-popover>
      {{ displayText }}
    </div>
    <input v-else type="text" class="form-control input-sm text-input" v-model="input" @blur="showTextInput = false" ref="textInput">
  </div>
</template>

<script>
  import { Popover } from 'element-ui'
  import InlineSelect from './InlineSelect'

  export default {
    components: {
      [Popover.name]: Popover,
      InlineSelect
    },
    props: {
      type: {
        type: String,
        default: 'text'
      },
      value: {
        required: true
      },
      editing: {
        type: Boolean,
        default: false
      },
      options: {
        type: Array,
        default () { return [] }
      }
    },
    data () {
      return {
        showPopup: false,
        showTextInput: false,
        input: null
      }
    },
    computed: {
      readOnlyCellStyle () {
        return {
          width: '100%',
          padding: '2px 5px',
          overflow: 'hidden',
          'white-space': 'no-wrap',
          'text-overflow': 'ellipsis'
        }
      },
      displayText () {
        if (!this.value) {
          return ''
        }
        if (this.type === 'text' || this.type === 'textarea') {
          return this.value
        } else if (this.type === 'single-select') {
          return this.value['label']
        } else if (this.type === 'multi-select') {
          return this.value.map(item => item['label']).join(',')
        }
      }
    },
    watch: {
      value () {
        if (this.type === 'text' || this.type === 'textarea') {
          this.input = this.value
        }
      },
      editing () {
        if (!this.editing) {
          this.showPopup = false
          this.showTextInput = false
        } else {
          if (this.type === 'text') {
            this.showTextInput = true
          } else {
            this.showPopup = true
          }
        }
      },
      showTextInput () {
        this.$emit('editing', true)
      },
      showPopup () {
        this.$emit('editing', true)
      },
      input () {
        this.$emit('input', this.input)
      }
    },
    methods: {
      onEditIconClicked () {
        if (this.type === 'text') {
          this.showTextInput = true
          this.$nextTick(() => {
            this.$refs.textInput.focus()
          })
        }
      },
      onDoubleClicked () {
        if (this.type === 'text') {
          this.showTextInput = true
          this.$nextTick(() => {
            this.$refs.textInput.focus()
          })
        } else {
          this.showPopup = true
        }
      }
    },
    created () {
      if (this.type === 'text' || this.type === 'textarea') {
        this.input = this.value
      }
    }
  }
</script>

<style scoped>
  input.text-input {
    height: 22px;
  }
</style>
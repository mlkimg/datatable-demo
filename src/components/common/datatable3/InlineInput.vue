<template>
  <div class="inline-input">
    <input v-if="type === 'text'" class="form-control input-sm" type="text" v-model="userInput"/>
    <input v-else-if="type === 'bookingText'" class="form-control input-sm" type="text" v-model="userInput" onkeyup="this.value=this.value.replace(/\D/g,'')" maxlength="5"/>
    <textarea v-else-if="type === 'textarea'" class="form-control input-sm" type="text" v-model="userInput"/>
    <inline-select v-else-if="type === 'single-select'" v-model="userInput" :options="options" @dropdown-opened="onSelectDropdownOpened" @dropdown-closed="onSelectDropdownClosed"/>
    <inline-select v-else-if="type === 'multi-select'" v-model="userInput" :options="options" @dropdown-opened="onSelectDropdownOpened" @dropdown-closed="onSelectDropdownClosed" :is-multiple="true"/>
    <datepicker v-else-if="type === 'date'" v-model="userInput" :embedded="true" :showClearBtn="false" :options="options"/>
    <date-range-picker v-else-if="type === 'date-range'" v-model="userInput" :auto-apply="true"/>
  </div>
</template>

<script>
  import _ from 'lodash'
  import MultiSelect from '../MultiSelect'
  import Datepicker from '../Datepicker'
  import DateRangePicker from '../DateRangePicker'
  import InlineSelect from './InlineSelect'

  export default {
    components: {
      MultiSelect,
      Datepicker,
      DateRangePicker,
      InlineSelect
    },
    props: {
      value: {
        required: true
      },
      type: {
        type: String,
        default: 'text' // support values are 'text', 'date', 'date-range', 'single-select'
      },
      options: {
        default () { return null }
      }
    },
    data () {
      return {
        userInput: null
      }
    },
    watch: {
      value () {
        if (this.value !== this.userInput) {
          this.userInput = _.cloneDeep(this.value)
        }
      },
      userInput () {
        this.$emit('input', this.userInput)
      }
    },
    methods: {
      onSelectDropdownOpened () {
        this.$emit('select-dropdown-opened')
      },
      onSelectDropdownClosed () {
        this.$emit('select-dropdown-closed')
      }
    },
    created () {
      this.userInput = _.cloneDeep(this.value)
    }
  }
</script>
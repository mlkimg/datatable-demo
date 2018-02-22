<template>
  <select multiple="multiple">
    <option v-for="option in options" :value="option[idField]">{{ option[labelField] }}</option>
  </select>
</template>

<script>
  import _ from 'lodash'
  import $ from 'jquery'
  import 'multiple-select/multiple-select.js'
  import 'multiple-select/multiple-select.css'

  export default {
    props: {
      value: null,
      options: {
        type: Array,
        default () { return [] }
      },
      idField: {
        type: String,
        default: 'id'
      },
      labelField: {
        type: String,
        default: 'label'
      },
      isMultiple: {
        type: Boolean,
        default: false
      },
      isDisabled: {
        type: Boolean,
        default: false
      },
      filter: {
        type: Boolean,
        default: false
      },
      placeholder: {
        type: String,
        default: null
      }
    },
    data () {
      return {
        optionMap: {}
      }
    },
    watch: {
      value () {
        this.onValueChanged()
      },
      options () {
        this.buildOptionMap()
        this.$nextTick(() => {
          $(this.$el).multipleSelect('refresh')
          this.onValueChanged()
        })
      },
      isDisabled () {
        this.disableIfNeeded()
      }
    },
    methods: {
      disableIfNeeded () {
        $(this.$el).multipleSelect(this.isDisabled ? 'disable' : 'enable')
      },
      onSelectsChanged () {
        this.$nextTick(() => {
          let selectedIds = $(this.$el).multipleSelect('getSelects')
          let value
          if (selectedIds.length === 0) {
            value = this.isMultiple ? [] : null
          } else {
            value = this.isMultiple ? selectedIds.map(selectedId => {
              return this.optionMap[selectedId]
            }) : this.optionMap[selectedIds[0]]
          }
          this.$emit('input', value)
        })
      },
      buildOptionMap () {
        this.optionMap = this.options.reduce((map, option) => {
          map[_.toString(option[this.idField])] = option
          return map
        }, {})
      },
      onValueChanged () {
        let selectedIds = _.isArray(this.value) ? this.value.map(item => item[this.idField]) : this.value ? [this.value[this.idField]] : []
        $(this.$el).multipleSelect('setSelects', selectedIds)
      }
    },
    created () {
      this.buildOptionMap()
    },
    mounted () {
      $(this.$el).multipleSelect({
        width: '100%',
        onCheckAll: this.onSelectsChanged,
        onUncheckAll: this.onSelectsChanged,
        onClick: this.onSelectsChanged,
        single: !this.isMultiple,
        filter: this.filter
      })
      this.onValueChanged()
      this.disableIfNeeded()
    }
  }
</script>
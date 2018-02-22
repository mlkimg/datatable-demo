<template>
  <div>
    <input type="text" class="form-control input-sm" v-model="filterText">
    <ul style="max-height: 200px;">
      <li v-if="isMultiple">
        <label>
          <input type="checkbox" value="selectAll" v-model="selectAll">
          [Select All]
        </label>
      </li>
      <li v-for="option in filteredOptions">
        <label>
          <input type="checkbox" :value="option.id" v-model="selectedMap[option.id]" @click="onCheckboxClicked(option, $event)">
          {{ option.label }}
        </label>
      </li>
      <!--<li>-->
        <!--<label>-->
          <!--<input type="checkbox" value="" v-model="blank">-->
          <!--[Blank]-->
        <!--</label>-->
      <!--</li>-->
    </ul>
  </div>
</template>

<script>
  export default {
    props: {
      options: {
        type: Array,
        default () { return [] }
      },
      value: {
        default: null
      },
      isMultiple: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        selectedMap: {},
        filterText: null,
        selectAll: false,
        blank: false
      }
    },
    computed: {
      filteredOptions () {
        let filterText = this.filterText ? this.filterText.toLowerCase() : null
        // return filterText ? this.options.filter(option => option.label.toLowerCase().indexOf(filterText) !== -1) : this.options
        // if (this.options && !this.options.some(option => option.id === 'blank_Value')) this.options.push({id: 'blank_Value', label: '[Blank]'})
        return filterText ? this.options.filter(option => option.label.toLowerCase().indexOf(filterText) !== -1) : this.options
      }
    },
    watch: {
      filterText () {
        this.selectAll = false
      },
      selectAll () {
        if (this.selectAll) {
          this.filteredOptions.forEach(option => {
            this.$set(this.selectedMap, option.id, true)
          })
        } else {
          this.filteredOptions.forEach(option => {
            this.$delete(this.selectedMap, option.id)
          })
        }
      },
      value () {
        if (this.isValueChanged()) {
          this.selectedMap = this.value2SelectedMap()
          if (this.value === null) {
            this.filterText = null
          }
        }
      },
      selectedMap () {
        let value = this.isMultiple ? (this.options ? this.options.filter(option => this.selectedMap[option.id]) : []) : (this.options ? this.options.find(option => this.selectedMap[option.id]) : null)
        this.$emit('input', value)
      }
    },
    methods: {
      onCheckboxClicked (option, event) {
        let checked = event.target.checked
        if (this.isMultiple) {
          this.selectedMap = {
            ...this.selectedMap,
            [option.id]: checked
          }
        } else {
          this.selectedMap = {
            [option.id]: true
          }
        }
      },
      isValueChanged () {
        if (this.value === 'blank_Value') {
          return false
        }
        if ((!this.value || !this.value.length) && Object.keys(this.selectedMap).length === 0) {
          return false
        } else if (!this.value || !this.value.length) {
          return true
        } else if (this.isMultiple) {
          return this.value.some(item => !this.selectedMap[item.id])
        } else {
          return !this.selectedMap[this.value.id]
        }
      },
      value2SelectedMap () {
        return this.value ? this.isMultiple ? this.value.reduce((map, item) => {
          map[item.id] = true
          return map
        }, {}) : { [this.value.id]: true } : {}
      }
    },
    created () {
      this.selectedMap = this.value2SelectedMap()
    }
  }
</script>

<style scoped>
  input[type="text"] {
    height: 24px;
  }
  ul {
    padding: 5px 8px;
    overflow: auto;
    margin: 0;
  }
  ul>li {
    list-style: none;
    display: list-item;
    position: static;
  }
  ul>li>label {
    max-width: 100%;
    margin-bottom: 5px;
    white-space: nowrap;
    display: block;
    font-weight: normal;
    font-size: 11px;
  }
  input[type="checkbox"] {
    margin: -2px 0 0 0;
    vertical-align: middle;
  }
  input[type="radio"] {
    margin: 0 0 0 0;
  }
</style>

<i18n>
{
  "en": {
    "apply": "Apply",
    "clear": "Clear",
    "close": "Close",
    "blank": "Blank"
  }
}
</i18n>

<template>
  <div class="cell">
    <div class="cell-row">
      <div>
        <div class="cell">
          <div class="cell-row" v-if="filter">
            <el-popover placement="bottom" width="230" trigger="manual" v-model="showFilterInput">
              <i class="fa fa-filter" :class="{ active: isFiltering || isCheckedBlank }" :title="hints.filter" @click="showFilterInput = !showFilterInput" slot="reference"></i>
              <div>
                <inline-input :type="filter.type" :options="filter.options" v-model="filterInput"/>
                <span class="pull-left">
                  <a href="#" @click.prevent="onFilterApplyClicked">{{ $t('apply') }}</a>
                  <a href="#" @click.prevent="onFilterClearClicked" style="margin-left: 5px;">{{ $t('clear') }}</a>
                  <a v-if="filter.type !== 'single-select' && filter.type !== 'multi-select'" href="#" @click.prevent="onFilterBlankClicked" style="margin-left: 5px;">{{ $t('blank') }}</a>
                </span>
                <span class="pull-right">
                  <a href="#" @click.prevent="showFilterInput = false">{{ $t('close') }}</a>
                </span>
              </div>
            </el-popover>
          </div>
          <div v-if="filter && editor"><br/></div>
          <div class="cell-row" v-if="editor">
            <el-popover placement="bottom" width="230" trigger="manual" v-model="showEditorInput">
              <i class="fa fa-edit" :class="{ active: isEditing }" :title="hints.editor" @click="showEditorInput = !showEditorInput" slot="reference"></i>
              <div v-if="editor.customRender">
                <custom-batch-update-editor-content :render-function="editor.customRender" :show-editor-input="showEditorInput" @show-editor-input-changed="showEditorInput = $event"/>
              </div>
              <div v-else>
                <inline-input :type="editor.type" :options="editor.options" v-model="editorInput"/>
                <span class="pull-left">
                  <a href="#" @click.prevent="onEditorApplyClicked">{{ $t('apply') }}</a>
                  <a v-if="editor.type === 'date-range'" href="#" @click.prevent="onDateRangeEditorClearClicked" style="margin-left: 5px;">{{ $t('clear') }}</a>
                </span>
                <span class="pull-right">
                  <a href="#" @click.prevent="showEditorInput = false">{{ $t('close') }}</a>
                </span>
              </div>
            </el-popover>
          </div>
        </div>
      </div>
      <slot>{{ label }}</slot>
      <i v-if="sorter" class="fa" :class="sortIconClass" :title="hints.sorter" @click="onSortIconClick"></i>
    </div>
  </div>
</template>

<script>
  import _ from 'lodash'
  // import $ from 'jquery'
  import { Popover } from 'element-ui'
  import InlineInput from './InlineInput'
  import en from './i18n/en'
  import CustomBatchUpdateEditorContent from './CustomBatchUpdateEditorContent'

  const sortIconClassMap = {
    normal: 'fa-sort',
    asc: 'fa-sort-asc active',
    desc: 'fa-sort-desc active'
  }

  const sortOrders = ['normal', 'asc', 'desc']

  export default {
    locales: {
      en
    },
    i18n: {
      messages: {
        en: { message: en }
      }
    },
    components: {
      InlineInput,
      [Popover.name]: Popover,
      CustomBatchUpdateEditorContent
    },
    props: {
      label: {
        type: String,
        default: ''
      },
      filter: {
        type: Object,
        default: null
      },
      editor: {
        type: Object,
        default: null
      },
      sorter: {
        type: Object,
        default: null
      },
      propFilterInput: {
        required: true
      },
      propEditorInput: {
        required: true
      }
    },
    data () {
      return {
        sortOrder: 'normal',
        hints: {
          filter: 'Filter',
          editor: 'Mass update',
          sorter: 'Sort'
        },
        filterInput: null,
        editorInput: null,
        showFilterInput: false,
        showEditorInput: false,
        isCheckedBlank: false
      }
    },
    computed: {
      sortIconClass () {
        return sortIconClassMap[this.sortOrder]
      },
      isFiltering () {
        /* console.info('this.filterInput~~')
        console.info(this.filterInput === '')
        console.info(!!this.filterInput) */
        return this.filter && (this.filter.type !== 'multi-select' ? !!this.filterInput : (_.isArray(this.filterInput) && this.filterInput.length > 0))
      },
      isEditing () {
        return this.editor && (this.editor.type !== 'multi-select' ? !!this.editorInput : (_.isArray(this.editorInput) && this.editorInput.length > 0))
      }
    },
    watch: {
      // filterInput (newVal, oldVal) {
      //   if (newVal || oldVal) {
      //     if (this.filter.type === 'text') {
      //       this.debounceFilterTextInput()
      //     } else {
      //       this.$emit('filter-input-changed', { filterInput: this.filterInput })
      //     }
      //   }
      // },
      // editorInput (newVal, oldVal) {
      //   if (newVal || oldVal) {
      //     if (this.editor.type === 'text') {
      //       this.debounceEditorTextInput()
      //     } else {
      //       this.$emit('editor-input-changed', { editorInput: this.editorInput })
      //     }
      //   }
      // },
      propFilterInput () {
        this.filterInput = _.cloneDeep(this.propFilterInput)
      },
      propEditorInput () {
        this.editorInput = _.cloneDeep(this.propEditorInput)
      },
      label () {
        this.filterInput = _.cloneDeep(this.propFilterInput)
        this.editorInput = _.cloneDeep(this.propEditorInput)
      },
      sorter () {
        this.sortOrder = this.sorter.order
      }
    },
    methods: {
      onSortIconClick () {
        let sortOrderIdx = sortOrders.indexOf(this.sortOrder)
        if (sortOrderIdx === sortOrders.length - 1) {
          sortOrderIdx = 0
        } else {
          sortOrderIdx++
        }
        this.sortOrder = sortOrders[sortOrderIdx]
        this.$emit('sort-order-changed', {
          sortOrder: this.sortOrder
        })
      },
      // debounceFilterTextInput: _.debounce(function () {
      //   this.$emit('filter-input-changed', { filterInput: this.filterInput })
      // }, 500),
      // debounceEditorTextInput: _.debounce(function () {
      //   this.$emit('editor-input-changed', { editorInput: this.editorInput })
      // }, 500),
      onFilterApplyClicked () {
        this.$emit('filter-input-changed', { filterInput: this.filterInput })
        this.showFilterInput = false
      },
      onEditorApplyClicked () {
        this.$emit('editor-input-changed', { editorInput: this.editorInput })
        this.showEditorInput = false
      },
      onFilterClearClicked () {
        this.isCheckedBlank = false
        this.filterInput = null
        this.$emit('filter-input-changed', { filterInput: this.filterInput })
        this.showFilterInput = false
      },
      onFilterBlankClicked () {
        // window.alert('kong')
        this.isCheckedBlank = true
        this.filterInput = 'blank_Value'
        this.$emit('filter-input-changed', { filterInput: this.filterInput })
        this.showFilterInput = false
      },
      onDateRangeEditorClearClicked () {
        this.editorInput = null
        this.$emit('editor-input-changed', { editorInput: this.editorInput })
        this.showEditorInput = false
      }
    },
    created () {
      for (let property in this.hints) {
        if (this[property] && this[property].hint && _.isString(this[property].hint)) {
          this.hints[property] = this[property].hint
        }
      }
    }
  }
</script>

<style scoped>
  .cell {
    width: 100%;
    height: 100%;
    display: table;
  }
  .cell>.cell-row {
    display: table-row;
  }
  .cell-row>* {
    display: table-cell;
    vertical-align: middle;
    overflow: hidden;
  }
  i.fa {
    opacity: 0.5;
    cursor: pointer;
  }
  i.fa.active {
    opacity: 1;
    color: white;
  }
  i.fa.fa-filter.active {
    opacity: 1;
    color: #ffc300;
  }
</style>

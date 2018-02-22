<template>
  <table :class="tableClass" :style="style">
    <thead>
      <tr class="first-row">
        <th class="no-padding no-border" style="width: 1px;"></th>
        <th v-if="showCheckbox" :style="checkboxColumnStyle"></th>
        <th v-if="isTree" :style="expanderColumnStyle"></th>
        <th v-for="column in leafColumns" :style="basicColumnStyle(column)"></th>
      </tr>
      <tr v-for="(rowColumns, rowIdx) in columns">
        <template v-if="rowIdx === 0">
          <th class="no-padding no-border" style="width: 1px;" :rowspan="columns.length">
          </th>
          <th v-if="showCheckbox" :style="checkboxColumnStyle" :rowspan="columns.length">
            <input type="checkbox" @click="onSelectAllClicked" ref="selectAll">
          </th>
          <th v-if="isTree" :style="expanderColumnStyle" :rowspan="columns.length">
            <expander v-model="expandAll" @click="onExpanderClick"/>
          </th>
          <header-cell
            v-for="column in rowColumns"
            :column="column"
            :filter-input="filterInput(column)"
            :editor-input="editorInput(column)"
            :column-group-expanded-state="columnGroupExpandedState"
            :enable-column-group-expand-collapse="enableColumnGroupExpandCollapse"
            @mouse-move="mouseMoveOnColumn(column, $event)"
            @mouse-down="mouseDownOnColumn(column, $event)"
            @mouse-out="mouseOutOfColumn(column, $event)"
            @column-sort-order-changed="$emit('column-sort-order-changed', $event)"
            @column-filter-input-changed="$emit('column-filter-input-changed', $event)"
            @column-editor-input-changed="$emit('column-editor-input-changed', $event)"
            @column-group-expand-state-changed="$emit('column-group-expand-state-changed', $event)"/>
        </template>
        <template v-else>
          <header-cell
            v-for="column in rowColumns"
            :column="column"
            :filter-input="filterInput(column)"
            :editor-input="editorInput(column)"
            :column-group-expanded-state="columnGroupExpandedState"
            :enable-column-group-expand-collapse="enableColumnGroupExpandCollapse"
            @mouse-move="mouseMoveOnColumn(column, $event)"
            @mouse-down="mouseDownOnColumn(column, $event)"
            @mouse-out="mouseOutOfColumn(column, $event)"
            @column-sort-order-changed="$emit('column-sort-order-changed', $event)"
            @column-filter-input-changed="$emit('column-filter-input-changed', $event)"
            @column-editor-input-changed="$emit('column-editor-input-changed', $event)"
            @column-group-expand-state-changed="$emit('column-group-expand-state-changed', $event)"/>
        </template>
      </tr>
    </thead>
  </table>
</template>

<script>
  import $ from 'jquery'
  import PropertyMixin from './PropertyMixin'
  import StyleMixin from './StyleMixin'
  import HeaderCell from './HeaderCell'
  import Expander from './Expander'

  const columnResizerHandlerRadius = 5

  export default {
    mixins: [
      PropertyMixin,
      StyleMixin
    ],
    components: {
      HeaderCell,
      Expander
    },
    props: {
      columns: {
        type: Array,
        required: true
      },
      leafColumns: {
        type: Array,
        required: true
      },
      style: {
        default () { return {} }
      },
      selectAllState: {
        type: String,
        required: true
      },
      filterInputs: {
        required: true
      },
      editorInputs: {
        required: true
      },
      columnGroupExpandedState: {
        type: Object,
        default () { return {} }
      },
      enableColumnGroupExpandCollapse: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        expandAll: false,
        columnResizingEvent: null
      }
    },
    watch: {
      expandAll () {
        const event = this.expandAll ? 'expand-all' : 'collapse-all'
        this.$emit(event)
      },
      columnResizingEvent (newEvent, oldEvent) {
        if (newEvent !== null) {
          this.$emit('column-resizing', { ...newEvent })
        } else {
          this.$emit('column-resizing-end', { ...oldEvent })
        }
      },
      selectAllState () {
        switch (this.selectAllState) {
          case 'all':
            $(this.$refs.selectAll).prop('indeterminate', false).prop('checked', true)
            break
          case 'indeterminate':
            $(this.$refs.selectAll).prop('indeterminate', true)
            break
          case 'none':
            $(this.$refs.selectAll).prop('indeterminate', false).prop('checked', false)
            break
          default:
            break
        }
      }
    },
    methods: {
      filterInput (column) {
        if (column.filter) {
          if (this.filterInputs[column.field]) {
            return this.filterInputs[column.field].input
          }
        }
        return null
      },
      editorInput (column) {
        if (column.editor) {
          if (this.editorInputs[column.field]) {
            return this.editorInputs[column.field]
          }
        }
        return null
      },
      onSelectAllClicked (event) {
        const vueEvent = event.target.checked ? 'select-all' : 'deselect-all'
        this.$emit(vueEvent)
      },
      isColumnResizable (column) {
        return !column.children && this.columnResizingEvent === null
      },
      onExpanderClick () {
        this.expandAll = !this.expandAll
      },
      mouseMoveOnColumn (column, event) {
        if (!this.isColumnResizable(column)) {
          return
        }

        let target = event.target
        while (target && target.tagName !== 'TH') {
          target = target.parentNode
        }

        if (!target || target.tagName !== 'TH') {
          return
        }

        let rect = target.getBoundingClientRect()
        if (rect.width > column.minWidth - columnResizerHandlerRadius && rect.right - event.clientX < columnResizerHandlerRadius) {
          document.body.style.cursor = 'col-resize'
        } else {
          document.body.style.cursor = ''
        }
      },
      mouseDownOnColumn (column, event) {
        if (!this.isColumnResizable(column)) {
          return
        }

        let target = event.target
        while (target && target.tagName !== 'TH') {
          target = target.parentNode
        }

        if (!target || target.tagName !== 'TH') {
          return
        }

        let rect = target.getBoundingClientRect()
        if (rect.width > column.minWidth - columnResizerHandlerRadius &&
            rect.right - event.clientX < columnResizerHandlerRadius &&
            this.columnResizingEvent === null) {
          this.columnResizingEvent = {
            minClientX: rect.left + column.minWidth,
            startClientX: rect.right,
            column: column,
            deltaX: 0
          }

          document.onselectstart = function () { return false }
          document.ondragstart = function () { return false }

          const onResizerMove = (event) => {
            const deltaX = event.clientX - this.columnResizingEvent.startClientX
            this.columnResizingEvent = {
              ...this.columnResizingEvent,
              deltaX
            }
          }

          const onResizerEnd = () => {
            if (this.columnResizingEvent) {
              this.columnResizingEvent = null
            }

            document.body.style.cursor = ''
            document.removeEventListener('mousemove', onResizerMove)
            document.removeEventListener('mouseup', onResizerEnd)
            document.onselectstart = null
            document.ondragstart = null
          }

          document.addEventListener('mousemove', onResizerMove)
          document.addEventListener('mouseup', onResizerEnd)
        }
      },
      mouseOutOfColumn (column, event) {
        if (!this.columnResizingEvent) {
          document.body.style.cursor = ''
        }
      }
    }
  }
</script>

<style scoped>
  table {
    margin-bottom: 0;
  }
  tr {
    /*background: #337ab7;*/
    background: #1587d0;
    color: white;
  }
  th {
    text-align: center;
    vertical-align: middle !important;
    padding-right: 6px !important;
  }
  .first-row>th {
    border-top: 0;
    border-bottom: 0;
    border-bottom-width: 0;
    padding: 0;
  }
  .no-padding {
    padding: 0 !important;
  }
  .no-border {
    border: 0 !important;
  }
</style>

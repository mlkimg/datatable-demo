import StyleMixin from './StyleMixin'
import FunctionalHeaderCell from './FunctionalHeaderCell'
// import _ from 'lodash'

export default {
  components: {
    FunctionalHeaderCell
  },
  props: {
    column: {
      type: Object,
      required: true
    },
    filterInput: {
      requierd: true
    },
    editorInput: {
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
  computed: {
    style () {
      return {
        ...StyleMixin.methods.basicColumnStyle(this.column),
        padding: '2px',
        'font-size': '12px',
        'font-weight': 'normal',
        'letter-spacing': '0.4px',
        // 'text-overflow': 'ellipsis',
        'overflow-x': 'hidden'
      }
    },
    rowSpan () {
      return this.column.rowSpan || 1
    },
    colSpan () {
      return this.column.colSpan || 1
    },
    expandCollapseIcon () {
      return this.columnGroupExpandedState[this.column.id] ? 'fa fa-minus' : 'fa fa-plus'
    }
  },
  // watch: {
  //   filterInput () {
  //     console.log(_.cloneDeep(this.filterInput))
  //   }
  // },
  methods: {
    onSortOrderChanged ({ sortOrder }) {
      this.$emit('column-sort-order-changed', {
        column: this.column,
        sortOrder
      })
    },
    onFilterInputChanged ({ filterInput }) {
      this.$emit('column-filter-input-changed', {
        column: this.column,
        filterInput
      })
    },
    onEditorInputChanged ({ editorInput }) {
      this.$emit('column-editor-input-changed', {
        column: this.column,
        editorInput
      })
    },
    onColumnExpandCollapseClicked () {
      this.columnGroupExpandedState[this.column.id] = !this.columnGroupExpandedState[this.column.id]
      this.$emit('column-group-expand-state-changed', {
        state: this.columnGroupExpandedState
      })
    }
  },
  render (h) {
    let { label, filter, editor, sortable, sortOrder } = this.column
    let sorter = sortable ? { order: sortOrder } : null
    return (
      <th
        style={this.style}
        rowspan={this.rowSpan}
        colspan={this.colSpan}
        on-mousemove={ ($event) => this.$emit('mouse-move', $event) }
        on-mousedown={ ($event) => this.$emit('mouse-down', $event) }
        on-mouseout={ ($event) => this.$emit('mouse-out', $event) }>
        {
          this.column.children ? <div style="position: relative;padding-left:30px;">
            { this.enableColumnGroupExpandCollapse ? <span style="position: absolute;left: 5px;top:2px;"><i style="cursor: pointer;font-size:14px;" class={this.expandCollapseIcon} on-click={this.onColumnExpandCollapseClicked}></i></span> : <span></span>}
            { this.column.renderHeaderCell(h) }
          </div>
        : <FunctionalHeaderCell
            label={label}
            filter={filter}
            editor={editor}
            sorter={sorter}
            prop-filter-input={this.filterInput}
            prop-editor-input={this.editorInput}
            on-sort-order-changed={this.onSortOrderChanged}
            on-filter-input-changed={this.onFilterInputChanged}
            on-editor-input-changed={this.onEditorInputChanged}>
          {
            this.column.renderHeaderCell(h)
          }
          </FunctionalHeaderCell>
      }
      </th>
    )
  }
}

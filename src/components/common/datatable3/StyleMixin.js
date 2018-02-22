import { pixelize } from './util'

const treeIconIndent = 5

export default {
  computed: {
    checkboxColumnWidth () {
      return 30 + (this.treeLevels - 1) * treeIconIndent
    },
    checkboxColumnStyle () {
      return {
        width: pixelize(this.checkboxColumnWidth),
        'max-width': pixelize(this.checkboxColumnWidth)
      }
    },
    expanderColumnWidth () {
      return 20 + Math.max(this.treeLevels - 2, 0) * treeIconIndent
    },
    expanderColumnStyle () {
      return {
        width: pixelize(this.expanderColumnWidth),
        'max-width': pixelize(this.expanderColumnWidth)
      }
    },
    scrollbarWidth () {
      // const outer = document.createElement('div')
      // outer.style.visibility = 'hidden'
      // outer.style.width = '100px'
      // outer.style.position = 'absolute'
      // outer.style.top = '-9999px'
      // document.body.appendChild(outer)

      // const widthNoScroll = outer.offsetWidth
      // outer.style.overflow = 'scroll'

      // const inner = document.createElement('div')
      // inner.style.width = '100%'
      // outer.appendChild(inner)

      // const widthWithScroll = inner.offsetWidth
      // outer.parentNode.removeChild(outer)
      // return widthNoScroll - widthWithScroll
      return 17
    }
  },
  methods: {
    treeIconStyle (row) {
      return {
        'margin-left': pixelize((row.treeLevel || 0) * treeIconIndent)
      }
    },
    rowStyle (row) {
      return row.style || {
        background: row.backgroundColor,
        color: row.color
      }
    },
    checkboxStyle (row) {
      return this.treeIconStyle(row)
    },
    expanderStyle (row) {
      return this.treeIconStyle(row)
    },
    basicColumnStyle (column) {
      return {
        padding: 0,
        // 'min-width': pixelize(column.width),
        // 'max-width': pixelize(column.width)
        width: pixelize(column.width)
      }
    }
  }
}

import { pixelize } from './util'

export default {
  props: {
    column: {
      type: Object,
      required: true
    },
    rowHeight: {
      type: Number,
      required: true
    },
    rowData: {
      type: Object,
      required: true
    }
  },
  computed: {
    dynamicStyle () {
      return {
        // padding: '2px 5px',
        padding: 0,
        'font-size': '11px',
        'overflow': 'hidden',
        'white-space': 'nowrap',
        'max-width': pixelize(this.column.width),
        height: pixelize(this.rowHeight)
      }
    }
  },
  methods: {
    renderCell (h) {
      return this.rowData ? this.column.renderCell(h, this.rowData, {
        width: this.column.width,
        height: this.rowHeight
      }) : null
    }
  },
  render (h) {
    return (
      <td style={this.dynamicStyle}>
      {
        this.renderCell(h)
      }
      </td>
    )
  }
}

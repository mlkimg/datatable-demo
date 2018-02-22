// import { pixelize } from '../util'

export default {
  label: 'Not Specify',
  field: 'default',
  width: 100,
  minWidth: 20,
  sortable: false,
  sortOrder: 'normal', // possible values are 'normal', 'asc' and 'desc'
  hidden: false,
  hidable: true,
  filter: undefined,
  /*
  {
    type: 'text' // possible values are 'text', 'single-select', 'multi-select', 'date', 'date-range'
    options: {...} // options for filter configuration
    mannual: false
    filter: function (rowData) {
      return true
    }
  }
  */
  editor: undefined, // similar with filter
  renderHeaderCell (h) {
    return (
      <div>
      {
        this.label
      }
      </div>
    )
  },
  renderCell (h, rowData, { width, height }) {
    return (
      <div style={{
        width: '100%',
        padding: '2px 5px',
        overflow: 'hidden',
        'white-space': 'nowrap',
        'text-overflow': 'ellipsis'
      }}>
      {
        rowData[this.field]
      }
      </div>
    )
  }
}

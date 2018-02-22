import shortId from 'shortid'

export default {
  id: shortId.generate(),
  tableClass: 'table table-bordered',
  selectionMode: 'none', // possible values are 'none', 'single' and 'multiple'
  treeLevels: 1,
  actualTreeLevels: 1,
  treeLevelLabels: [],
  columns: [],
  rowIdField: 'id',
  expandedRowIds: {},
  selectedRowIds: {},
  sortOrders: [], // looks like [{field: 'field_1', order: 'asc'}, {field: 'field_2', order: 'desc'}]
  filterInputs: {},
  globalSearchInput: null,
  fixedToColumnIdx: -1,
  height: 300,
  rowHeight: 24, // must be >= 24
  highlightRowOnSelected: false,
  enableColumnGroupExpandCollapse: false,
  noRecordsDisplayMessage: 'No records to display',
  paginationOptions: {
    currentPage: 1,
    rowsPerPage: 10,
    rowsPerPageOptions: [10, 20, 50],
    numberOfPages: 1,
    toPage: 1,
    labelGoTo: 'Go to',
    labelRowsPerPage: 'rows / page',
    total: 0,
    labelTotal: 'Total',
    labelTotalNumberUnit: ''
  },
  rowStyle (row) {
    return null
  }
}

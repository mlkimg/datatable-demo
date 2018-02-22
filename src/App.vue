<template>
  <div id="app">
    <div class="row">
      <div class="col-md-10 col-md-offset-1">
        <button class="btn btn-primary btn-xs" @click="testSelectCheckboxProgrammatically">Select the 1st record (level 1)</button>
      </div>
    </div>

    <div class="row">
      <div class="col-md-10 col-md-offset-1">
        <datatable 
          :data="data" 
          :options="datatableOptions"
          @selected-rows-changed="onSelectedRowsChanged"
          @pagination-changed="onPaginationChanged"
          @sort-orders-changed="onSortOrdersChanged"
          @filter-inputs-changed="onFilterInputsChanged"
          @batch-update-input-changed="onBatchUpdateInputChanged"
          @show-to-tree-level="onShowToTreeLevel"
          @columns-settings-changed="onColumnsSettingsChanged"
          @options-updated="onOptionsUpdated"
          @visible-rows-changed="onVisibleRowsChanged"/>
      </div>
    </div>

    <div class="row">
      <div class="col-md-10 col-md-offset-1">
        
      </div>
    </div>
  </div>
</template>

<script>
  import _ from 'lodash'
  import 'bootstrap/dist/css/bootstrap.css'
  import 'bootstrap/dist/js/bootstrap'
  import Datatable from './components/common/datatable3/LocalDataWrapper'
  import EditableCell from './components/common/datatable3/EditableCell'
  import MultiSelect from './components/common/MultiSelect'
  import columns from './columns'
  import treeData from './tree-data'

  export default {
    name: 'App',
    components: {
      Datatable,
      EditableCell,
      MultiSelect
    },
    data () {
      // Configures column header's filter & Make it to be inline editing
      let customColumns = columns.map(col => {
        let column = _.cloneDeep(col)
        let { label } = column

        // Makes column "Style Complex" to be with "text" filter
        if (label === 'Style Complex') {
          column.filter = {
            type: 'text'
          }
        }

        // Makes column "Status" to be with 
        // 1. "multiple-select" filter
        // 2. inline editing with "multiple-select" drop-down
        // 3. custom font color of header text
        if (label === 'Status') {
          column.filter = {
            type: 'multi-select',
            options: [
              {id: 'PENDING', label: 'PENDING'},
              {id: 'CONFIRMED', label: 'CONFIRMED'}
            ]
          }
          column.renderHeaderCell = (h) => {
            return (
              <div style="color: black;">
              {
                column.label
              }
              </div>
            )
          }
          const statuses = [
            {id: 'PENDING', label: 'PENDING'},
            {id: 'CONFIRMED', label: 'CONFIRMED'}
          ]
          column.renderCell = (h, rowData) => {
            if (rowData[column.field] !== undefined) {
              return (
                <EditableCell
                  displayText={rowData[column.field]}
                  popoverWidth={250}
                  renderEditor={(h) => {
                    return (
                      <MultiSelect options={statuses} value={
                        rowData[column.field].split(',').map(item => {
                          return {
                            id: item,
                            label: item
                          }
                        })
                      } on-input={(selectedStatus) => {
                        rowData['Status'] = selectedStatus ? selectedStatus.map(status => status.label).join(',') : null
                        const findRowData = data => {
                          let result
                          data.some(levelOneRowData => {
                            result = levelOneRowData.children.find(levelTwoRowData => {
                              return levelTwoRowData.id === rowData.id
                            })
                            return !!result
                          })
                          return result
                        }
                        let originRowData = findRowData(this.data)
                        originRowData['Status'] = rowData['Status']
                        this.data = [...this.data]
                      }}
                      isMultiple={true}/>
                    )
                  }}/>
              )
            } else {
              return null
            }
          }
        }

        // Make red background color for cell & white font color for text where current units < 1000
        if (label === 'Current Units') {
          column.renderCell = (h, rowData) => {
            let currentUnits = rowData[column.field]
            if (currentUnits < 1000) {
              return (
                <div style={{
                  width: '100%',
                  padding: '2px 5px',
                  overflow: 'hidden',
                  'white-space': 'nowrap',
                  'text-overflow': 'ellipsis',
                  'background-color': '#dd4b39',
                  'color': 'white'
                }}>
                {
                  currentUnits
                }
                </div>
              )
            } else {
              return (
                <div style={{
                  width: '100%',
                  padding: '2px 5px',
                  overflow: 'hidden',
                  'white-space': 'nowrap',
                  'text-overflow': 'ellipsis'
                }}>
                {
                  currentUnits
                }
                </div>
              )
            }
          }
        }

        return column
      })
      return {
        data: [],
        datatableOptions: {
          columns: customColumns,
          selectionMode: 'multiple',
          highlightRowOnSelected: true,
          enableColumnGroupExpandCollapse: true
        }
      }
    },
    methods: {
      onSelectedRowsChanged ({ componentId, selectedRowIds }) {},
      onPaginationChanged ({ componentId, page, rowsPerPage }) {},
      onSortOrdersChanged ({ componentId, sortOrders }) {},
      onFilterInputsChanged ({ componentId, filterInputs }) {},
      onBatchUpdateInputChanged ({ componentId, field, editor, input }) {},
      onShowToTreeLevel ({ componentId, treeLevel }) {},
      onColumnsSettingsChanged ({ componentId, columns }) {},
      onOptionsUpdated ({ options }) {},
      onVisibleRowsChanged () {},
      testSelectCheckboxProgrammatically () {
        const extractIdsRecursively = (rowData, ids) => {
          ids.push(rowData.id)
          if (_.isArray(rowData.children)) {
            rowData.children.forEach(child => {
              extractIdsRecursively(child, ids)
            })
          }
        }
        let ids = []
        extractIdsRecursively(treeData[0], ids)
        let selectedRowIds = ids.reduce((map, id) => {
          map[id] = true
          return map
        }, {})
        this.datatableOptions = {
          selectedRowIds
        }
      }
    },
    mounted () {
      this.data = treeData
    }
  }
</script>

<style>

</style>

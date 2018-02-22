<template>
    <datatable
      :options="datatableOptions"
      :data="pagingData[currentPage - 1]"
      @pagination-changed="onPaginationChanged"
      @sort-orders-changed="onSortOrdersChanged"
      @filter-inputs-changed="onFilterInputsChanged"
      @selected-rows-changed="onSelectedRowsChanged"
      @batch-update-input-changed="onBatchUpdateInputChanged"
      @show-to-tree-level="onShowToTreeLevel"
      @columns-settings-changed="onColumnsSettingsChanged"
      @rows-per-page-selected="onRowsPerPageSelected"
      @fixed-to-column-idx-changed="onFixedToColumnIdxChanged"
      @export-btn-clicked="onExportBtnClicked"
      @columns-changed="onColumnsChanged"
      @global-search="onGlobalSearch"
      @clear-filters-done="onClearFiltersDone"
      @visible-rows-changed="onVisibleRowsChanged"/>
</template>

<script>
  import _ from 'lodash'
  import moment from 'moment'
  import Datatable from './Datatable'
  import datatableDefaultOptions from './options/datatable'
  import json2csv from 'json2csv'
  import FileSaver from 'file-saver'
  import { datatableDataDescentClone } from './helper'
  import { getAllLeafNodes } from './util'

  export default {
    components: {
      Datatable
    },
    props: {
      options: {
        type: Object,
        required: true
      },
      data: {
        type: Array,
        required: true
      },
      exportFileName: {
        type: String,
        default: 'export'
      },
      customExport: {
        type: Function,
        default: null
      }
    },
    data () {
      return {
        currentPage: 1,
        rowsPerPage: 10,
        numberOfPages: 1,
        sortOrders: [],
        filterInputs: {},
        datatableOptions: _.cloneDeep(datatableDefaultOptions),
        globalSearchInput: null
      }
    },
    computed: {
      sortedData () {
        if (this.sortOrders.length) {
          let sortingStrategy = this.sortOrders.reduce((sortingStrategy, { field, order }) => {
            sortingStrategy[0].push(field)
            sortingStrategy[1].push(order)
            return sortingStrategy
          }, [[], []])
          const recursiveSort = (data) => {
            data.forEach(rowData => {
              if (rowData.children) {
                rowData.children = recursiveSort(rowData.children)
              }
            })
            return _.orderBy(data, ...sortingStrategy)
          }
          return recursiveSort(this.filteredData)
        }
        return this.filteredData
      },
      filteredByColumnsData () {
        const recursiveFilterData = (data) => {
          return data.filter(rowData => {
            let isMatched = true
            for (let field in this.filterInputs) {
              let { filter, input } = this.filterInputs[field]
              if (_.isFunction(filter.filter)) {
                isMatched = filter.filter(rowData, input)
              } else {
                if (input === 'blank_Value') {
                  let value = rowData[field]
                  if (value !== undefined && value !== null && value !== '' && value !== 'P') {
                    isMatched = false
                  }
                  break
                } else if (input) {
                  let value = rowData[field]
                  if (value === undefined) continue
                  /* if (value === undefined) {
                    continue
                  } else if (value === null || value === '') {
                    isMatched = false
                    break
                  } */
                  switch (filter.type) {
                    case 'text':
                      if (_.isNumber(value)) {
                        isMatched = value === Number(input)
                      } else {
                        let trimInputText = input.trim()
                        if (trimInputText) {
                          isMatched = value.toLowerCase().indexOf(trimInputText.toLowerCase()) !== -1
                        }
                      }
                      break
                    case 'single-select':
                      if (input.id) {
                        isMatched = value === input.id || (input.id === 'blank_Value' && (value === undefined || value === '' || value === null || value === 'P' || value === '-1'))
                      }
                      break
                    case 'multi-select':
                      // isMatched = input.length === 0 || input.some(anInput => value === anInput.id)
                      isMatched = input.length === 0 || input.some(anInput => anInput.id === 'blank_Value' ? value === undefined || value === '' || value === null || value === 'P' || value === '-1' : value === anInput.id)
                      break
                    case 'date':
                      isMatched = value === input
                      break
                    case 'date-range':
                      {
                        let date = moment(value)
                        isMatched = date.isValid() && date.isBetween(input.from, input.to, null, '[]')
                      }
                      break
                    default:
                      break
                  }
                }
              }
              if (!isMatched) {
                break
              }
            }
            if (isMatched && rowData.children) {
              rowData.children = recursiveFilterData(rowData.children)
              isMatched = rowData.children.length !== 0
            }
            return isMatched
          })
        }
        let data = []
        if (Object.keys(this.filterInputs).length) {
          data = recursiveFilterData(_.cloneDeep(this.data))
        } else {
          data = _.cloneDeep(this.data)
        }
        this.setColumnOptionList(data)
        return data
      },
      filteredData () {
        let globalSearchInput = this.globalSearchInput ? this.globalSearchInput.toLowerCase() : null
        const recursiveFilterData = (data) => {
          return data.filter(rowData => {
            let isMatched = false
            for (let field in rowData) {
              let value = rowData[field]
              if (!_.isNil(value) && !_.isString(value)) {
                value = value.toString()
              }
              if (value && value.toLowerCase().indexOf(globalSearchInput) !== -1) {
                isMatched = true
                break
              }
            }
            if (!isMatched && rowData.children) {
              rowData.children = recursiveFilterData(rowData.children)
              isMatched = rowData.children.length !== 0
            }
            return isMatched
          })
        }
        if (this.globalSearchInput) {
          return recursiveFilterData(_.cloneDeep(this.filteredByColumnsData))
        } else {
          return this.filteredByColumnsData
        }
      },
      pagingData () {
        let pagingData = _.chunk(this.sortedData, this.rowsPerPage)
        if (this.numberOfPages !== pagingData.length) {
          this.numberOfPages = pagingData.length
        }
        return pagingData
      }
    },
    watch: {
      'filteredData.length': function () {
        this.datatableOptions = {
          ...this.datatableOptions,
          selectedRowIds: {},
          paginationOptions: {
            ..._.omit(this.datatableOptions.paginationOptions, ['rowsPerPage']),
            currentPage: 1,
            numberOfPages: this.numberOfPages,
            total: this.filteredData.length
          }
        }
      },
      filterInputs () {
        // console.log(_.cloneDeep(this.filterInputs))
        this.datatableOptions = {
          ...this.datatableOptions,
          filterInputs: this.filterInputs,
          globalSearchInput: this.globalSearchInput,
          selectedRowIds: {},
          paginationOptions: {
            ..._.omit(this.datatableOptions.paginationOptions, ['rowsPerPage']),
            currentPage: 1,
            numberOfPages: this.numberOfPages,
            total: this.filteredData.length
          }
        }
      },
      globalSearchInput () {
        this.datatableOptions = {
          ...this.datatableOptions,
          filterInputs: this.filterInputs,
          globalSearchInput: this.globalSearchInput,
          selectedRowIds: {},
          paginationOptions: {
            ..._.omit(this.datatableOptions.paginationOptions, ['rowsPerPage']),
            currentPage: 1,
            numberOfPages: this.numberOfPages,
            total: this.filteredData.length
          }
        }
      },
      numberOfPages () {
        this.datatableOptions = {
          ...this.datatableOptions,
          selectedRowIds: {},
          paginationOptions: {
            ..._.omit(this.datatableOptions.paginationOptions, ['rowsPerPage']),
            numberOfPages: this.numberOfPages
          }
        }
      },
      options () {
        // console.log(_.cloneDeep(this.datatableOptions))
        // this.datatableOptions = _.cloneDeep(this.options)
        if (this.options && this.options.paginationOptions) {
          this.datatableOptions.paginationOptions = {
            ...this.datatableOptions.paginationOptions,
            ...this.options.paginationOptions
          }
        }
        this.datatableOptions = {
          ...this.options,
          paginationOptions: {
            ...this.datatableOptions.paginationOptions,
            // currentPage: 1,
            numberOfPages: this.numberOfPages,
            total: this.filteredData.length
          }
        }
        if (this.options.columns) {
          this.columns = this.options.columns
        }
        if (this.options.fixedToColumnIdx !== undefined) {
          this.fixedToColumnIdx = this.options.fixedToColumnIdx
        }
        if (this.options.filterInputs) {
          this.filterInputs = _.cloneDeep(this.options.filterInputs)
        }
        if (this.options.globalSearchInput !== undefined) {
          this.globalSearchInput = _.cloneDeep(this.options.globalSearchInput)
        }
        // console.log(_.cloneDeep(this.datatableOptions))
      }
    },
    methods: {
      setColumnOptionList (data) {
        const getIsMatchOption = (isMatch, data, field, optionsItem) => {
          data.forEach(item => {
            if (item[field] === optionsItem) {
              isMatch = true
            }
            if (!isMatch) {
              if (item.children !== undefined) {
                isMatch = getIsMatchOption(isMatch, item.children, field, optionsItem)
              }
            }
          })
          return isMatch
        }
        const getIsNullOption = (isNull, data, field) => {
          let index = 0
          data.forEach(item => {
            let itemIsNull = false
            if (item[field] !== undefined && item[field] !== null && item[field] !== '' && item[field] !== 'P' && item[field] !== '-1') {
              itemIsNull = true
            }
            if (!itemIsNull) {
              if (item.children !== undefined) {
                itemIsNull = getIsNullOption(itemIsNull, item.children, field)
              }
            }
            if (itemIsNull) {
              index = index + 1
            }
          })
          if (index !== data.length) {
            return false
          } else {
            return true
          }
        }
        const filterColumnOptions = (data, field, options) => {
          let list = []
          options.forEach(optionsItem => {
            let isMatch = false
            if (optionsItem.id !== undefined && optionsItem.id !== null && optionsItem.id !== '' && optionsItem.label !== undefined && optionsItem.label !== null && optionsItem.label !== '') {
              isMatch = getIsMatchOption(isMatch, data, field, optionsItem.id)
            }
            if (isMatch) {
              list.push(optionsItem)
            }
          })
          let isNull = false
          isNull = getIsNullOption(isNull, data, field)
          if (!isNull) {
            list.push({id: 'blank_Value', label: '[Blank]'})
          }
          return list
        }

        if (this.options !== undefined && this.options.columns !== undefined) {
          let oldColumnsData = _.cloneDeep(this.options.columns)
          oldColumnsData.forEach(item => {
            if (item.filter !== undefined && item.filter.options !== undefined) {
              item.filter.options = filterColumnOptions(_.cloneDeep(data), item.field, item.filter.options)
            }
            if (item.children !== undefined) {
              item.children.forEach(itemChild => {
                if (itemChild.filter !== undefined && itemChild.filter.options !== undefined) {
                  itemChild.filter.options = filterColumnOptions(_.cloneDeep(data), itemChild.field, itemChild.filter.options)
                }
              })
            }
          })
          this.datatableOptions.columns = _.cloneDeep(oldColumnsData)
        }
      },
      onPaginationChanged ({ componentId, page, rowsPerPage }) {
        this.currentPage = page
        this.rowsPerPage = rowsPerPage
        this.$emit('pagination-changed', { componentId, page, rowsPerPage })
      },
      onSortOrdersChanged ({ componentId, sortOrders }) {
        this.sortOrders = sortOrders
        if (sortOrders.length > 0) {
          this.columns.forEach(rowData => {
            if (rowData.field === sortOrders[0].field) {
              rowData.sortOrder = sortOrders[0].order
            } else {
              rowData.sortOrder = 'normal'
            }
          })
        } else {
          this.columns.forEach(rowData => {
            rowData.sortOrder = 'normal'
          })
        }
        this.datatableOptions = {
          columns: _.cloneDeep(this.columns),
          filterInputs: this.filterInputs,
          globalSearchInput: this.globalSearchInput,
          selectedRowIds: {},
          paginationOptions: {
            ..._.omit(this.datatableOptions.paginationOptions, ['rowsPerPage']),
            currentPage: 1,
            numberOfPages: this.numberOfPages,
            total: this.filteredData.length
          }
        }
        this.$emit('sort-orders-changed', { componentId, sortOrders })
      },
      onFilterInputsChanged ({ componentId, filterInputs }) {
        this.filterInputs = _.cloneDeep(filterInputs)
        this.$emit('filter-inputs-changed', { componentId, filterInputs })
      },
      onSelectedRowsChanged ({ componentId, selectedRowIds }) {
        this.$emit('selected-rows-changed', { componentId, selectedRowIds })
      },
      onBatchUpdateInputChanged (event) {
        this.$emit('batch-update-input-changed', event)
      },
      onShowToTreeLevel ({ componentId, treeLevel }) {
        let rowIdField = this.options.rowIdField || 'id'
        let expandedRowIds = {}
        const recursiveToFindRowIds = ({ level, data }) => {
          if (level <= treeLevel - 1) {
            data.forEach(rowData => {
              expandedRowIds[rowData[rowIdField]] = true
              if (rowData.children) {
                recursiveToFindRowIds({
                  level: level + 1,
                  data: rowData.children
                })
              }
            })
          }
        }
        recursiveToFindRowIds({ level: 0, data: this.data })
        this.datatableOptions = {
          // ...this.datatableOptions,
          expandedRowIds
        }
        this.$emit('show-to-tree-level', { componentId, treeLevel })
      },
      onColumnsSettingsChanged ({ columns }) {
        this.columns = columns
        this.$emit('columns-settings-changed', _.cloneDeep(this.columns))
        this.updateOptions()
      },
      onRowsPerPageSelected ({ rowsPerPage }) {
        this.rowsPerPage = rowsPerPage
        this.updateOptions()
      },
      onFixedToColumnIdxChanged ({ fixedToColumnIdx }) {
        this.fixedToColumnIdx = fixedToColumnIdx
        this.updateOptions()
      },
      onExportBtnClicked () {
        let data = _.cloneDeep(this.sortedData)
        if (this.customExport && _.isFunction(this.customExport)) {
          this.customExport({
            data,
            columns: _.cloneDeep(this.columns)
          })
        } else {
          datatableDataDescentClone({ data })
          let exportData = getAllLeafNodes(data)

          const getAllFieldsAndLabels = () => {
            let fields = []
            let labels = []
            const recursiveExtract = (columns, parentLabels) => {
              columns.forEach(column => {
                if (column.children) {
                  let parentLabelsCopy = _.cloneDeep(parentLabels)
                  parentLabelsCopy.push(column.label)
                  recursiveExtract(column.children, parentLabelsCopy)
                } else if (!column.hidden) {
                  fields.push(column.field)
                  // labels.push(column.label)
                  let fullLabels = _.cloneDeep(parentLabels)
                  fullLabels.push(column.label)
                  labels.push(fullLabels.join(' - '))
                }
              })
            }
            recursiveExtract(this.columns, [])
            return { fields, labels }
          }

          let { fields, labels } = getAllFieldsAndLabels()
          let csvData = json2csv({
            data: exportData,
            fields,
            fieldNames: labels
          })
          let csvFile = new window.File([csvData], this.exportFileName + '.csv', { type: 'text/csv;charset=utf-8' })
          FileSaver.saveAs(csvFile)
        }
      },
      onColumnsChanged ({ columns }) {
        if (!this.columns) {
          this.columns = columns
        }
      },
      updateOptions: _.debounce(function () {
        let updatedOptions = {
          columns: _.cloneDeep(this.columns),
          fixedToColumnIdx: this.fixedToColumnIdx,
          paginationOptions: {
            rowsPerPage: this.rowsPerPage
          }
        }
        this.$emit('options-updated', { options: updatedOptions })
      }, 1000),
      onGlobalSearch (globalSearchInput) {
        this.globalSearchInput = globalSearchInput
      },
      onClearFiltersDone () {
        this.datatableOptions.clearFilters = false
      },
      onVisibleRowsChanged () {
        this.$emit('visible-rows-changed')
      }
    },
    created () {
      this.datatableOptions = _.cloneDeep(this.options)
    }
  }
</script>

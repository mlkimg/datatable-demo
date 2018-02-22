<i18n>
{
  "en": {
    "clearAllFilters": "Clear All Filters",
    "download": "Download",
    "userPreferences": "User Preference Setting"
  }
}
</i18n>

<template>
  <div class="root" :style="style">
    <div class="header" :style="headerStyle">
      <div class="row">
        <div class="col-md-6">
          <!-- <div class="btn-group btn-group-xs" role="group">
            <button v-for="(label, treeLevel) in treeLevelBtnLabels" class="btn btn-success" @click="onTreeLevelBtnClicked(treeLevel)">{{ label }}</button>
          </div> -->
          <div class="tree-level-btn-group" v-if="treeLevels > 1">
            <button v-for="(label, treeLevel) in treeLevelBtnLabels" class="btn btn-success btn-xs" :style="treeLevelBtnStyle(treeLevel)" @click="onTreeLevelBtnClicked(treeLevel)">{{ label }}</button>
          </div>
        </div>
        <div class="col-md-6">
          <div class="pull-right">
            <div class="form-inline">
              <div class="input-group">
                <input type="text" class="form-control input-xs" v-model.trim="globalSearchInput" @keyup.enter="onGlobalSearchBtnClicked">
                <span class="input-group-btn">
                  <button type="submit" class="btn btn-flat btn-xs" @click="onGlobalSearchBtnClicked">
                    <i class="fa fa-search"></i>
                  </button>
                </span>
              </div>
              <button class="btn btn-xs clear-filter-btn" data-toggle="tooltip" :title="$t('clearAllFilters')" @click="resetFilters">
                <i class="fa fa-ban">
                  <i class="fa fa-filter"></i>
                </i>
              </button>
              <button class="btn btn-xs download-btn" data-toggle="tooltip" :title="$t('download')" @click="onExportBtnClicked"><i class="fa fa-download"></i></button>
              <button class="btn btn-xs settings-btn" data-toggle="tooltip" :title="$t('userPreferences')" @click="showSettings = !showSettings"><i class="fa fa-gear"></i></button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="body">
      <div class="header-table-container" :style="headerTableContainerStyle">
        <header-table
          :table-class="tableClass"
          :style="headerTableStyle"
          :is-tree="isTree"
          :tree-levels="treeLevels"
          :show-checkbox="showCheckbox"
          :columns="headerColumns"
          :leafColumns="bodyColumns" ref="headerTable"
          :select-all-state="selectAllState"
          :filter-inputs="filterInputs"
          :editor-inputs="editorInputs"
          :column-group-expanded-state="columnGroupExpandedState"
          :enable-column-group-expand-collapse="enableColumnGroupExpandCollapse"
          @column-resizing="onColumnResizing"
          @column-resizing-end="onColumnResizingEnd"
          @column-sort-order-changed="onSortOrderChanged"
          @column-filter-input-changed="onFilterInputChanged"
          @column-group-expand-state-changed="onColumnGroupExpandStateChanged"
          @column-editor-input-changed="onBatchUpdateInputChanged"/>
        <div class="gutter-container" :style="gutterStyle">
          <div class="gutter">
            <!-- <i class="fa fa-gear" @click="showSettings = !showSettings"></i> -->
          </div>
        </div>
      </div>
      <div class="body-table-container" :style="bodyTableContainerStyle" @scroll="onBodyTableContainerScroll" ref="bodyTableContainer">
        <body-table
          :table-class="tableClass"
          :is-tree="isTree"
          :tree-levels="treeLevels"
          :show-checkbox="showCheckbox"
          :columns="bodyColumns"
          :rows="visibleRows"
          :row-height="rowHeight"
          :table-width="tableWidth - scrollbarWidth"
          :table-height="bodyTableHeight"
          :clusterized-table-offset-y="clusterizedTableOffsetY"
          @mouseover-on-row="onRowMouseover"
          @mouseleave-on-row="onRowMouseleave"
          ref="bodyTable"/>
          <p style="height:40px;line-height:40px;font-weight:900;text-align: center;" v-if="data.length === 0">{{ noRecordsDisplayMessage }}</p>
      </div>
      <div class="fixed-container" :style="fixedContainerStyle" ref="fixedContainer">
        <div class="header-table-container" :style="fixedHeaderTableContainerStyle" ref="fixedHeaderTableContainer">
          <header-table
            :table-class="tableClass"
            :is-tree="isTree"
            :tree-levels="treeLevels"
            :show-checkbox="showCheckbox"
            :columns="headerColumns"
            :leafColumns="bodyColumns"
            :select-all-state="selectAllState"
            :filter-inputs="filterInputs"
            :editor-inputs="editorInputs"
            :column-group-expanded-state="columnGroupExpandedState"
            :enable-column-group-expand-collapse="enableColumnGroupExpandCollapse"
            @select-all="onSelectAll"
            @deselect-all="onDeselectAll"
            @expand-all="expandAll = true"
            @collapse-all="expandAll = false"
            @column-resizing="onColumnResizing"
            @column-resizing-end="onColumnResizingEnd"
            @column-sort-order-changed="onSortOrderChanged"
            @column-filter-input-changed="onFilterInputChanged"
            @column-editor-input-changed="onBatchUpdateInputChanged"
            @column-group-expand-state-changed="onColumnGroupExpandStateChanged"
            ref="fixedHeaderTable"/>
        </div>
        <!-- placeholder for resize detector -->
        <div style="height: 1px;"></div>
        <div class="body-table-container" :style="fixedBodyTableContainerStyle">
          <body-table
            :table-class="tableClass"
            :is-tree="isTree"
            :tree-levels="treeLevels"
            :show-checkbox="showCheckbox"
            :columns="fixedBodyColumns"
            :rows="visibleRows"
            :is-fixed="true"
            :row-height="rowHeight"
            :table-width="fixedTableWidth"
            :table-height="bodyTableHeight"
            :clusterized-table-offset-y="clusterizedTableOffsetY"
            @row-expander-click="onRowExpanderClick"
            @row-checkbox-click="onRowCheckboxClick"
            @mouseover-on-row="onRowMouseover"
            @mouseleave-on-row="onRowMouseleave"
            ref="fixedBodyTable"/>
        </div>
      </div>
      <div v-show="showColumnResizer" class="column-resizer" :style="columnResizerStyle" ref="columnResizer"></div>
    </div>
    <div class="footer" :style="footerStyle" ref="footer">
      <pagination :options="paginationOptions" @change="onPaginationChanged" @rows-per-page-selected="onRowsPerPageSelected"/>
    </div>
    <settings
      :show="showSettings"
      @show="showSettings = true"
      @hide="showSettings = false"
      :columns="columns"
      :fixed-to-column-idx="fixedToColumnIdx"
      @columns-changed="onColumnSettingsChanged"
      @fixed-to-column-idx-changed="onFixedToColumnIdxChanged"
      @settings-reset-clicked="onSettingsResetClicked"/>
  </div>
</template>

<script>
  import _ from 'lodash'
  import $ from 'jquery'
  import 'bootstrap/dist/css/bootstrap.min.css'
  import 'bootstrap/dist/js/bootstrap'
  import shortId from 'shortid'
  import ResizeDetector from 'element-resize-detector'
  import 'jquery.scrollto'
  import 'jquery-mousewheel'
  import { pixelize, flattenTree, generateBackgroundForegroundGrayPairs } from './util'
  import en from './i18n/en'
  import defaultOptions from './options/datatable'
  import defaultColumnOptions from './options/column'
  import defaultColumnGroupOptions from './options/columnGroup'
  import StyleMixin from './StyleMixin'
  import HeaderTable from './HeaderTable'
  import BodyTable from './BodyTable'
  import Pagination from './Pagination'
  import Settings from './settings/Settings'

  export default {
    locales: {
      en
    },
    mixins: [
      StyleMixin
    ],
    components: {
      HeaderTable,
      BodyTable,
      Pagination,
      Settings
    },
    props: {
      data: {
        type: Array,
        default () { return [] }
      },
      options: {
        type: Object,
        default () { return _.cloneDeep(defaultOptions) }
      }
    },
    data () {
      return {
        ..._.cloneDeep(defaultOptions),
        width: 0,
        bodyTableHeight: 0,
        headerTableHeight: 0,
        showColumnResizer: false,
        selectAllState: 'none',
        expandAll: false,
        showSettings: false,
        expandedTreeLevels: [],
        // showToTreeLevel: 0,
        clusterSize: 0,
        firstVisbleRowNumber: 0,
        mouseoverRowId: null,
        editorInputs: {},
        originalColumns: [],
        originalFixedToColumnIdx: -1,
        treeLevelToShow: 0,
        columnGroupExpandedState: {}
      }
    },
    computed: {
      isTree () {
        return this.treeLevels > 1
      },
      treeLevelBtnLabels () {
        return this.treeLevelLabels && this.treeLevelLabels.length ? this.treeLevelLabels : _.times(this.treeLevels, treeLevel => {
          return 'Level ' + (treeLevel + 1)
        })
      },
      showCheckbox () {
        return this.selectionMode === 'multiple'
      },
      headerColumns () {
        let headerColumns = []
        this.recursiveConfigHeaderColumns({
          row: 0,
          columns: this.extractVisibleColumns(this.columns),
          headerColumns
        })
        let rows = headerColumns.length
        let flatHeaderColumns = _.flatten(headerColumns)
        flatHeaderColumns.forEach(headerColumn => {
          let { row } = headerColumn
          headerColumn.rowSpan = headerColumn.children ? 1 : rows - row
          headerColumn.colSpan = flatHeaderColumns.filter(childColumn => {
            return !childColumn.children &&
                    childColumn.parentColumnRefs &&
                    childColumn.parentColumnRefs.length > row &&
                    childColumn.parentColumnRefs[row] === headerColumn
          }).length || 1
        })
        flatHeaderColumns.forEach(headerColumn => {
          if (headerColumn.parentColumnRefs) {
            delete headerColumn.parentColumnRefs
          }
        })
        return headerColumns
      },
      bodyColumns () {
        // let result = _.flatten(this.headerColumns).filter(headerColumn => !headerColumn.children)
        return flattenTree(this.extractVisibleColumns(this.columns)).filter(column => !column.children)
      },
      fixedVisibleColumns () {
        let fixedColumns = this.columns.slice(0, this.fixedToColumnIdx + 1)
        return this.extractVisibleColumns(fixedColumns)
      },
      fixedBodyColumns () {
        return flattenTree(this.fixedVisibleColumns).filter(column => !column.children)
      },
      allRowIds () {
        return flattenTree(this.data).map(rowData => rowData[this.rowIdField])
      },
      allParentRowIds () {
        return flattenTree(this.data).filter(rowData => rowData.children).map(rowData => rowData[this.rowIdField])
      },
      flatRows () {
        let maxTreeLevel = 0
        const rowIdField = this.rowIdField
        const flattenData = ({ data, rows, treeLevel, parents }) => {
          maxTreeLevel = Math.max(treeLevel, maxTreeLevel)
          return data.map(rowData => {
            let row = {
              id: rowData[rowIdField],
              data: rowData,
              treeLevel
            }
            if (parents) {
              row.parents = parents
            }
            rows.push(row)
            if (rowData.children) {
              if (!parents) {
                parents = []
              }
              let parentsCopy = [...parents]
              parentsCopy.push(row)
              row.children = flattenData({
                data: rowData.children,
                rows,
                treeLevel: treeLevel + 1,
                parents: parentsCopy
              })
            } else {
              row.isLeaf = true
            }
            return row
          })
        }
        let rows
        rows = []
        flattenData({
          data: this.data,
          rows,
          treeLevel: 0
        })
        this.treeLevels = maxTreeLevel + 1
        if (this.treeLevels > this.actualTreeLevels) {
          this.actualTreeLevels = this.treeLevels
        }
        return rows
      },
      rows () {
        let rows = [...this.flatRows]
        let colorPairs = this.levelBgFgColorPairs
        rows.forEach(row => {
          let colorPair = colorPairs[row.treeLevel]
          row.backgroundColor = colorPair[0]
          row.color = colorPair[1]
          row.show = this.isParentRowExpanded(row)
          row.selected = this.isRowSelected(row)
          if (row.id === this.mouseoverRowId) {
            row.backgroundColor = '#e9fcca'
            row.color = '#333'
          } else if (this.highlightRowOnSelected && row.selected) {
            row.backgroundColor = '#bff890'
            row.color = '#333'
          }
          if (!row.isLeaf) {
            row.expand = !!this.expandedRowIds[row.id]
          }
          if (this.rowStyle && this.rowStyle instanceof Function) {
            row.style = this.rowStyle(row)
          }
        })
        return rows
      },
      expandedRows () {
        return this.rows.filter(row => row.show)
      },
      visibleRows () {
        return this.expandedRows.slice(this.firstVisbleRowNumber, Math.min(this.expandedRows.length, this.firstVisbleRowNumber + this.clusterSize))
      },
      levelBgFgColorPairs () {
        return this.treeLevels > 1 ? generateBackgroundForegroundGrayPairs(this.actualTreeLevels) : [['white', '#333']]
      },
      style () {
        return {
          height: pixelize(this.height)
        }
      },
      tableWidth () {
        return this.bodyColumns.reduce((width, column) => width + column.width, 0) +
                (this.showCheckbox ? this.checkboxColumnWidth : 0) +
                (this.isTree ? this.expanderColumnWidth : 0) +
                this.scrollbarWidth + 1
      },
      tableContainerWidth () {
        return Math.min(this.tableWidth, this.width)
      },
      headerTableContainerStyle () {
        return {
          width: pixelize(this.tableContainerWidth),
          height: pixelize(this.headerTableHeight)
        }
      },
      headerTableStyle () {
        return {
          width: pixelize(this.tableWidth - this.scrollbarWidth)
        }
      },
      bodyTableContainerHeight () {
        return Math.min(this.height - this.headerTableHeight - $(this.$refs.footer).height(), this.bodyTableHeight + (this.isShowingHorizontalScrollbar ? this.scrollbarWidth : 0))
      },
      bodyTableContainerStyle () {
        if (this.data.length === 0) {
          return {
            width: pixelize(this.tableContainerWidth),
            height: pixelize(this.bodyTableContainerHeight + 40)
          }
        } else {
          return {
            width: pixelize(this.tableContainerWidth),
            height: pixelize(this.bodyTableContainerHeight)
          }
        }
      },
      fixedTableWidth () {
        return this.fixedBodyColumns.reduce((width, column) => width + column.width, 0) +
                (this.showCheckbox ? this.checkboxColumnWidth : 0) +
                (this.isTree ? this.expanderColumnWidth : 0) + 1
      },
      fixedHeaderTableContainerStyle () {
        return {
          width: pixelize(this.fixedContainerWidth)
        }
      },
      fixedContainerWidth () {
        return Math.min(this.width - this.scrollbarWidth, this.fixedTableWidth)
      },
      fixedContainerStyle () {
        return {
          width: pixelize(this.fixedContainerWidth),
          height: pixelize(this.headerTableHeight + this.bodyTableContainerHeight - (this.isShowingHorizontalScrollbar ? this.scrollbarWidth : 0))
        }
      },
      fixedBodyTableContainerStyle () {
        return {
          width: pixelize(this.fixedContainerWidth),
          height: pixelize(this.bodyTableContainerHeight - (this.isShowingHorizontalScrollbar ? this.scrollbarWidth : 0))
        }
      },
      gutterStyle () {
        return {
          width: pixelize(this.scrollbarWidth)
        }
      },
      headerStyle () {
        return {
          width: pixelize(this.tableContainerWidth)
        }
      },
      footerStyle () {
        return {
          width: pixelize(this.tableContainerWidth)
        }
      },
      columnResizerStyle () {
        return {
          height: pixelize(this.headerTableHeight + this.bodyTableContainerHeight - (this.isShowingHorizontalScrollbar ? this.scrollbarWidth : 0))
        }
      },
      isShowingHorizontalScrollbar () {
        return this.tableWidth + this.scrollbarWidth + 1 > this.width
      },
      clusterizedTableOffsetY () {
        return this.firstVisbleRowNumber * this.rowHeight
      }
    },
    watch: {
      // options () {
      //   if (this.optionsCopy !== this.value) {
      //     this.applyOptions()
      //   }
      // },
      expandedRows () {
        this.bodyTableHeight = this.expandedRows.length * this.rowHeight + 2
      },
      bodyTableContainerHeight () {
        this.clusterSize = Math.ceil(this.bodyTableContainerHeight / this.rowHeight) + 1
      },
      allRowIds () {
        this.updateSelectAllState()
      },
      selectedRowIds () {
        this.updateSelectAllState()
      },
      expandAll () {
        // this.$emit('show-to-tree-level', { componentId: this.id, treeLevel: this.expandAll ? this.treeLevels - 1 : 0 })
        this.treeLevelToShow = this.expandAll ? this.treeLevels - 1 : 0
      },
      columns () {
        this.$emit('columns-changed', { columns: _.cloneDeep(this.columns) })
      },
      treeLevelToShow () {
        if (_.isInteger(this.treeLevelToShow)) {
          this.$emit('show-to-tree-level', { componentId: this.id, treeLevel: this.treeLevelToShow })
        }
      },
      visibleRows () {
        this.$emit('visible-rows-changed')
      },
      'options.expandedRowIds': function (expandedRowIds) {
        if (_.isPlainObject(expandedRowIds)) {
          this.expandedRowIds = expandedRowIds
        }
      },
      'options.columns': function (columns) {
        if (_.isArray(columns) && columns.length) {
          this.columns = this.recursiveConfigColumns(columns)
        }
      },
      'options.fixedToColumnIdx': function (fixedToColumnIdx) {
        if (_.isInteger(fixedToColumnIdx)) {
          this.fixedToColumnIdx = fixedToColumnIdx
        }
      },
      'options.paginationOptions': function (paginationOptions) {
        if (_.isPlainObject(paginationOptions)) {
          this.paginationOptions = paginationOptions
        }
      },
      'options.selectedRowIds': function (selectedRowIds) {
        if (_.isPlainObject(selectedRowIds)) {
          this.selectedRowIds = _.cloneDeep(selectedRowIds)
        }
      },
      'options.height': function (height) {
        if (_.isNumber(height)) {
          this.height = height
        }
      },
      'options.treeLevelToShow': function (treeLevelToShow) {
        if (_.isInteger(treeLevelToShow)) {
          this.treeLevelToShow = treeLevelToShow
        }
      },
      'options.clearFilters': function (shouldClearFilter) {
        if (shouldClearFilter === true) {
          this.resetFilters()
          this.$emit('clear-filters-done')
        }
      },
      'options.filterInputs': function (filterInputs) {
        if (_.isPlainObject(filterInputs)) {
          this.filterInputs = _.cloneDeep(filterInputs)
        }
      },
      'options.globalSearchInput': function (globalSearchInput) {
        console.log('options.globalSearchInput is changed')
        this.globalSearchInput = _.cloneDeep(globalSearchInput)
      }
    },
    methods: {
      applyOptions () {
        let validOptions = _.pick(this.options, Object.keys(defaultOptions))
        let finalOptions = { ...defaultOptions, ...validOptions }
        const shallowCopyProperties = ['paginationOptions', 'rowStyle']
        const customCopyProperties = ['columns']
        for (let property in finalOptions) {
          if (customCopyProperties.indexOf(property) !== -1) {
            continue
          }
          if (shallowCopyProperties.indexOf(property) === -1) {
            this[property] = _.cloneDeep(finalOptions[property])
          } else {
            this[property] = finalOptions[property]
          }
        }
        this.columns = this.recursiveConfigColumns(finalOptions.columns)
        this.originalColumns = _.cloneDeep(this.columns)
        this.originalFixedToColumnIdx = this.fixedToColumnIdx
      },
      recursiveConfigColumns (columns) {
        return columns.map(column => {
          if (column.children) {
            let validColumnGroupOptions = _.pick(column, Object.keys(defaultColumnGroupOptions))
            let finalColumnGroupOptions = { ...defaultColumnGroupOptions, ...validColumnGroupOptions }
            if ((finalColumnGroupOptions.children instanceof Array) === false || finalColumnGroupOptions.children.length === 0) {
              finalColumnGroupOptions.children = [ _.cloneDeep(defaultColumnOptions) ]
            }
            finalColumnGroupOptions.children = this.recursiveConfigColumns(finalColumnGroupOptions.children)
            finalColumnGroupOptions.id = 'column_group_' + shortId.generate()
            return finalColumnGroupOptions
          } else {
            let validColumnOptions = _.pick(column, Object.keys(defaultColumnOptions))
            let finalColumnOptions = { ...defaultColumnOptions, ...validColumnOptions }
            finalColumnOptions.id = 'column_' + shortId.generate()
            let columnSortOrder = this.sortOrders.find(sortOrder => sortOrder.field === finalColumnOptions.field)
            if (columnSortOrder) {
              finalColumnOptions.sortOrder = columnSortOrder.order
            }
            // this.configHeaderCell(finalColumnOptions)
            return finalColumnOptions
          }
        })
      },
      recursiveConfigHeaderColumns ({ row, columns, headerColumns, parentColumnRefs }) {
        if (headerColumns.length <= row) {
          headerColumns.push([])
        }
        columns.forEach(column => {
          let headerColumn = {
            ...column,
            row
          }
          if (parentColumnRefs) {
            headerColumn.parentColumnRefs = parentColumnRefs
          }
          if (headerColumn.children) {
            if (!parentColumnRefs) {
              parentColumnRefs = []
            }
            let parentColumnRefsCopy = [...parentColumnRefs]
            parentColumnRefsCopy.push(headerColumn)
            this.recursiveConfigHeaderColumns({
              row: row + 1,
              columns: headerColumn.children,
              headerColumns,
              parentColumnRefs: parentColumnRefsCopy
            })
          }
          headerColumns[row].push(headerColumn)
        })
      },
      extractVisibleColumns (columns) {
        const flattenAndMapParent = function ({ columns, parent, flatColumns }) {
          columns.forEach(column => {
            if (parent) {
              column.parent = parent
            }
            if (column.children) {
              flattenAndMapParent({
                columns: column.children,
                parent: column,
                flatColumns
              })
            }
            flatColumns.push(column)
          })
        }
        const recursiveCorrectColumnVisibilities = function ({ columns, checked }) {
          let next = []
          columns.forEach(column => {
            if (column.parent && checked.indexOf(column.parent) === -1) {
              column.parent.hidden = column.parent.children.every(child => child.hidden)
              checked.push(column.parent)
              next.push(column.parent)
            }
          })
          if (next.length) {
            recursiveCorrectColumnVisibilities({ columns: next, checked })
          }
        }
        const recursiveConfigColumnGroupExpandedState = ({ columns }) => {
          columns.forEach(column => {
            if (!column.hidden && column.children) {
              column.children.forEach((childColumn, index) => {
                if (index) {
                  childColumn.hidden = !this.columnGroupExpandedState[column.id]
                } else {
                  childColumn.hidden = false
                }
                if (childColumn.children) {
                  recursiveConfigColumnGroupExpandedState({
                    columns: childColumn.children
                  })
                }
              })
            }
          })
        }
        const recursiveAddVisibleColumns = function ({ columns, visibleColumns }) {
          columns.forEach(column => {
            if (!column.hidden) {
              visibleColumns.push(column)
              if (column.children) {
                let childColumns = column.children
                let childVisibleColumns = []
                recursiveAddVisibleColumns({
                  columns: childColumns,
                  visibleColumns: childVisibleColumns
                })
                column.children = childVisibleColumns
              }
            }
          })
        }
        let flatColumns = []
        flattenAndMapParent({
          columns: columns,
          flatColumns
        })
        if (this.enableColumnGroupExpandCollapse) {
          recursiveConfigColumnGroupExpandedState({
            columns: flatColumns.filter(column => column.children && !column.parent)
          })
        }
        recursiveCorrectColumnVisibilities({
          columns: flatColumns.filter(column => !column.children),
          checked: []
        })
        flatColumns.forEach(column => {
          if (column.parent) {
            delete column.parent
          }
        })
        let visibleColumns = []
        recursiveAddVisibleColumns({
          columns: _.cloneDeep(columns),
          visibleColumns
        })
        return visibleColumns
      },
      isParentRowExpanded (row) {
        return !row.parents ||
                row.parents.every(parent => this.expandedRowIds[parent.id])
      },
      isRowSelected (row) {
        return !!this.selectedRowIds[row.id]
      },
      // syncRowHeights: _.throttle(function () {
      //   let tableRows = $(this.$refs.bodyTable.$el).find('tr')
      //   let fixedTableRows = $(this.$refs.fixedBodyTable.$el).find('tr')
      //   fixedTableRows.each((index, element) => {
      //     let firstFixedColumnCell = $(element).find('td').first()
      //     let firstColumnCell = $(tableRows[index]).find('td').first()
      //     firstFixedColumnCell.height(firstColumnCell.height())
      //   })
      // }, 300),
      treeLevelBtnStyle (treeLevel) {
        let levelBgFgColorPair = this.levelBgFgColorPairs[treeLevel]
        return {
          'background-color': this.treeLevelToShow === treeLevel ? '#e9fdca' : levelBgFgColorPair[0],
          // color: levelBgFgColorPair[1],
          color: 'black',
          'border-color': '#333'
        }
      },
      onRowExpanderClick ({ row }) {
        let isRowExpanded = this.expandedRowIds[row.id]
        if (!isRowExpanded) {
          this.$set(this.expandedRowIds, row.id, true)
        } else {
          this.$delete(this.expandedRowIds, row.id)
        }
      },
      updateSelectAllState () {
        if (this.allRowIds.length > 0) {
          let numberOfSelectedRows = this.allRowIds.reduce((count, rowId) => {
            if (this.selectedRowIds[rowId]) {
              count++
            }
            return count
          }, 0)
          if (numberOfSelectedRows === this.allRowIds.length) {
            this.selectAllState = 'all'
          } else if (numberOfSelectedRows > 0) {
            this.selectAllState = 'indeterminate'
          } else {
            this.selectAllState = 'none'
          }
        }
      },
      onSelectAll () {
        // const setRowSelectState = this.selectAll
        // ? (rowId) => {
        //   if (!this.selectedRowIds[rowId]) {
        //     this.$set(this.selectedRowIds, rowId, true)
        //   }
        // }
        // : (rowId) => {
        //   if (this.selectedRowIds[rowId]) {
        //     this.$delete(this.selectedRowIds, rowId)
        //   }
        // }
        this.allRowIds.forEach(rowId => {
          if (!this.selectedRowIds[rowId]) {
            this.$set(this.selectedRowIds, rowId, true)
          }
        })
        let selectedRowIds = _.cloneDeep(this.selectedRowIds)
        this.$emit('selected-rows-changed', { componentId: this.id, selectedRowIds })
      },
      onDeselectAll () {
        this.allRowIds.forEach(rowId => {
          if (this.selectedRowIds[rowId]) {
            this.$delete(this.selectedRowIds, rowId)
          }
        })
        let selectedRowIds = _.cloneDeep(this.selectedRowIds)
        this.$emit('selected-rows-changed', { componentId: this.id, selectedRowIds })
      },
      onRowCheckboxClick ({ row }) {
        let isRowSelected = this.selectedRowIds[row.id]
        if (!isRowSelected) {
          this.$set(this.selectedRowIds, row.id, true)
        } else {
          this.$delete(this.selectedRowIds, row.id)
        }

        isRowSelected = !!this.selectedRowIds[row.id]
        const syncParent = isRowSelected
        ? (parent) => {
          if (parent.children.every(child => !!this.selectedRowIds[child.id])) {
            this.$set(this.selectedRowIds, parent.id, true)
            return true
          }
          return false
        }
        : (parent) => {
          if (this.selectedRowIds[parent.id]) {
            this.$delete(this.selectedRowIds, parent.id)
            return true
          }
          return false
        }
        const syncChild = isRowSelected
        ? (child) => {
          if (!this.selectedRowIds[child.id]) {
            this.$set(this.selectedRowIds, child.id, true)
          }
        }
        : (child) => {
          if (this.selectedRowIds[child.id]) {
            this.$delete(this.selectedRowIds, child.id)
          }
        }
        const recursiveSyncChildren = (row) => {
          if (row.children) {
            row.children.forEach(child => {
              syncChild(child)
              recursiveSyncChildren(child)
            })
          }
        }

        if (row.parents) {
          _.clone(row.parents).reverse().every(syncParent)
        }
        recursiveSyncChildren(row)

        let selectedRowIds = _.cloneDeep(this.selectedRowIds)
        this.$emit('selected-rows-changed', { componentId: this.id, selectedRowIds })
      },
      onResize () {
        this.width = $(this.$el).innerWidth()
      },
      onHeaderTableResize (element) {
        this.headerTableHeight = $(this.$refs.headerTable.$el).outerHeight()
      },
      onBodyTableResize () {
        this.bodyTableHeight = $(this.$refs.bodyTable.$el).outerHeight()
        // this.syncRowHeights()
      },
      onBodyTableContainerResize () {
        let bodyTable = $(this.$refs.bodyTable.$el)
        let fixedBodyTable = $(this.$refs.fixedBodyTable.$el)
        fixedBodyTable.offset({
          top: bodyTable.offset().top,
          left: fixedBodyTable.offset().left
        })
      },
      onFixedHeaderTableContainerResize () {
        // fix chrome render problem when resize first column + fixed first column
        $(this.$refs.fixedHeaderTable.$el).find('th').toggle().toggle()
      },
      onBodyTableContainerScroll () {
        let headerTable = $(this.$refs.headerTable.$el)
        let bodyTable = $(this.$refs.bodyTable.$el)
        let fixedBodyTable = $(this.$refs.fixedBodyTable.$el)
        let bodyTableOffset = bodyTable.offset()
        let bodyTableContainerOffset = $(this.$refs.bodyTableContainer).offset()
        headerTable.offset({
          top: headerTable.offset().top,
          left: bodyTableOffset.left
        })
        fixedBodyTable.offset({
          top: bodyTableOffset.top,
          left: fixedBodyTable.offset().left
        })
        let tableOffsetY = bodyTableOffset.top - bodyTableContainerOffset.top
        this.firstVisbleRowNumber = Math.floor(-1 * tableOffsetY / this.rowHeight)
      },
      onColumnResizing (event) {
        const moveColumnResizer = () => {
          let { minClientX, startClientX, deltaX } = event
          let resizer = $(this.$refs.columnResizer)
          let root = $(this.$el)
          let rootClientLeft = this.$el.getBoundingClientRect().left
          let resizerClientLeft = Math.max(minClientX, startClientX + deltaX)
          let resizerOffsetLeft = root.offset().left + (resizerClientLeft - rootClientLeft)
          resizer.offset({
            top: resizer.offset().top,
            left: resizerOffsetLeft
          })
        }
        if (!this.showColumnResizer) {
          this.showColumnResizer = true
          this.$nextTick(moveColumnResizer)
        } else {
          moveColumnResizer()
        }
      },
      onColumnResizingEnd (event) {
        this.showColumnResizer = false
        let { minClientX, startClientX, deltaX, column } = event
        let columnClientLeft = minClientX - column.minWidth
        let finalColumnClientRight = Math.max(minClientX, startClientX + deltaX)
        let columnWidth = finalColumnClientRight - columnClientLeft
        let flatColumns = flattenTree(this.columns)
        let columnToBeResized = flatColumns.find(col => col.field === column.field)
        if (columnToBeResized) {
          columnToBeResized.width = columnWidth
        }
        this.columns = [...this.columns]
        this.$emit('columns-settings-changed', { componentId: this.id, columns: this.columns })
      },
      onPaginationChanged (event) {
        this.$emit('pagination-changed', {
          ...event,
          componentId: this.id
        })
      },
      onSortOrderChanged ({ column, sortOrder }) {
        // this.$emit('sort-order-changed', { column, sortOrder })
        this.sortOrders = []
        let originalSortOrderIdx = this.sortOrders.findIndex(({ field }) => field === column.field)
        if (originalSortOrderIdx !== -1) {
          this.sortOrders.splice(originalSortOrderIdx, 1)
        }
        if (sortOrder === 'asc' || sortOrder === 'desc') {
          this.sortOrders.push({
            field: column.field,
            order: sortOrder
          })
        }
        this.$emit('sort-orders-changed', {
          componentId: this.id,
          sortOrders: _.cloneDeep(this.sortOrders)
        })
      },
      onFilterInputChanged ({ column, filterInput }) {
        this.$set(this.filterInputs, column.field, {
          filter: column.filter,
          input: filterInput
        })
        this.$emit('filter-inputs-changed', {
          componentId: this.id,
          filterInputs: _.cloneDeep(this.filterInputs)
        })
      },
      resetFilters () {
        this.filterInputs = {}
        this.globalSearchInput = null
        this.$emit('global-search', this.globalSearchInput)
        this.$emit('filter-inputs-changed', {
          componentId: this.id,
          filterInputs: {}
        })
      },
      onBatchUpdateInputChanged ({ column, editorInput }) {
        this.editorInputs[column.field] = editorInput
        this.$emit('batch-update-input-changed', {
          componentId: this.id,
          field: column.field,
          editor: column.editor,
          input: editorInput
        })
      },
      onTreeLevelBtnClicked (treeLevel) {
        // let rowIds = this.rows.filter(row => {
        //   return !row.isLeaf && row.treeLevel <= treeLevel - 1
        // }).map(row => row.id)
        // this.expandedRowIds = rowIds.reduce((rowIdMap, rowId) => {
        //   rowIdMap[rowId] = true
        //   return rowIdMap
        // }, {})
        // this.showToTreeLevel = treeLevel
        this.treeLevelToShow = treeLevel
        // this.$emit('show-to-tree-level', { componentId: this.id, treeLevel })
      },
      onColumnSettingsChanged ({ newColumns }) {
        this.columns = newColumns
        this.$emit('columns-settings-changed', { componentId: this.id, columns: this.columns })
      },
      onRowsPerPageSelected ({ rowsPerPage }) {
        this.$emit('rows-per-page-selected', { componentId: this.id, rowsPerPage })
      },
      onFixedToColumnIdxChanged ({ fixedToColumnIdx }) {
        this.fixedToColumnIdx = fixedToColumnIdx
        this.$emit('fixed-to-column-idx-changed', { componentId: this.id, fixedToColumnIdx })
      },
      onExportBtnClicked () {
        this.$emit('export-btn-clicked', { componentId: this.id })
      },
      onRowMouseover ({ row }) {
        this.mouseoverRowId = row.id
      },
      onRowMouseleave ({ row }) {
        this.mouseoverRowId = null
      },
      onSettingsResetClicked () {
        this.columns = _.cloneDeep(this.originalColumns)
        this.fixedToColumnIdx = this.originalFixedToColumnIdx
        this.$emit('columns-settings-changed', { componentId: this.id, columns: this.columns })
        this.$emit('fixed-to-column-idx-changed', { componentId: this.id, fixedToColumnIdx: this.fixedToColumnIdx })
      },
      onGlobalSearchBtnClicked () {
        this.$emit('global-search', this.globalSearchInput)
      },
      onColumnGroupExpandStateChanged ({ state }) {
        this.columnGroupExpandedState = {...state}
      }
    },
    created () {
      this.applyOptions()
    },
    mounted () {
      this.resizeDetector = ResizeDetector()
      this.resizeDetector.listenTo(this.$el, this.onResize)
      this.resizeDetector.listenTo(this.$refs.headerTable.$el, this.onHeaderTableResize)
      // this.resizeDetector.listenTo(this.$refs.bodyTable.$el, this.onBodyTableResize)
      this.resizeDetector.listenTo(this.$refs.bodyTableContainer, this.onBodyTableContainerResize)
      this.resizeDetector.listenTo(this.$refs.fixedHeaderTableContainer, this.onFixedHeaderTableContainerResize)
      $(this.$refs.fixedContainer)[0].onwheel = function () { return false }
      $(this.$refs.fixedContainer).on('mousewheel', event => {
        let { deltaX, deltaY, deltaFactor } = event
        let delta = 0
        let axis
        let direction
        let step
        if (deltaX !== 0) {
          delta = deltaX * deltaFactor
          axis = 'x'
        } else if (deltaY !== 0) {
          delta = deltaY * deltaFactor
          axis = 'y'
        }
        if (delta !== 0) {
          direction = delta > 0 ? '-' : '+'
          step = direction + '=' + (delta < 0 ? -1 * delta : delta)
          $(this.$refs.bodyTableContainer).scrollTo(step, { axis })
        }
      })
    },
    destroyed () {
      try {
        this.resizeDetector.uninstall(this.$el)
        this.resizeDetector.uninstall(this.$refs.headerTable.$el)
        // this.resizeDetector.uninstall(this.$refs.bodyTable.$el)
        this.resizeDetector.uninstall(this.$refs.bodyTableContainer)
        this.resizeDetector.uninstall(this.$refs.fixedHeaderTableContainer)
      } catch (error) {
      }
      $(this.$refs.fixedContainer).off('mousewheel')
    }
  }
</script>

<style scoped>
  * {
    font-family: 'Roboto Condensed', sans-serif;
    /*font-family: Roboto;
    font-size: 12px;
    font-weight: normal;
    font-style: normal;
    font-stretch: condensed;
    letter-spacing: 0.4px;*/
  }
  .root, .body {
    position: relative;
  }
  table {
    table-layout: fixed;
    font-size: 12px;
  }
  .header-table-container {
    position: relative;
    overflow: hidden;
  }
  .body-table-container {
    overflow-x: auto;
    overflow-y: scroll;
  }
  .fixed-container {
    position: absolute;
    overflow: hidden;
    top: 0;
    left: 0;
    /*z-index: 50;*/
    box-shadow: 1px 0 8px -2px #333;
  }
  .fixed-container>.body-table-container {
    overflow: hidden;
  }
  .gutter-container {
    position: absolute;
    top: 0;
    right: 0;
    background: transparent;
    color: white;
    text-align: center;
    border: 1px solid #f4f4f4;
    height: 100%;
    border-top-width: 1px;
    border-bottom-width: 1px;
  }
  .gutter {
    /*background: #337ab7;*/
    background: #1587d0;
    height: 100%;
  }
  i.fa {
    /*cursor: pointer;*/
    font-family: FontAwesome;
  }
  .column-resizer {
    position: absolute;
    top: 0;
    border-left: 1px solid #c9e5f5;
    color: #1f2d3d;
    z-index: 51;
  }
  .header {
    background: white;
  }
  .footer {
    height: 30px;
    background: white;
  }
  .tree-level-btn-group > button {
    margin-right: 5px;
  }
  .settings-btn {
    background: #1587d0;
    color: white;
  }
  .download-btn {
    background: #1587d0;
    color: white;
  }
  .clear-filter-btn {
    background: #1587d0;
    color: white;
  }
  .clear-filter-btn>.fa {
    position: relative;
    color: rgba(255, 255, 255, 1);
  }
  .clear-filter-btn>.fa>.fa {
    position: absolute;
    top: 2px;
    left: 2px;
    font-size: 70%;
    color: rgba(255, 255, 255, 0.8);
  }
  i.fa.deactive {
    opacity: 0.5;
  }
  .input-xs {
    height: 22px;
    padding: 2px 5px;
    font-size: 12px;
    line-height: 1.5;
    border-radius: 3px;
  }
  .body-table-container::-webkit-scrollbar {
    width: 17px;
    height: 17px;
  }
  .body-table-container::-webkit-scrollbar-button {
    background-size: 100%;
    height: 17px;
    width: 17px;
    -webkit-box-shadow: inset 1px 1px 2px rgba(0,0,0,0.2);
  }
  .body-table-container::-webkit-scrollbar-button:horizontal:increment {
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAV0lEQVQ4T73TwQoAIAgD0Pnn9eWFh27qFlJCt3wFU0OzLOkfAPzQyoAFYCpIBfjrFGEARRSgRFQgRW6AEPkKhImoP0jjVIByFhjQGiTa7LE8Wya6hefCBhILGhGzGTl7AAAAAElFTkSuQmCC);
  }
  .body-table-container::-webkit-scrollbar-button:horizontal:decrement {
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAWUlEQVQ4T72TQQoAIAgEt5fX08ODYJbgKiR4c0YUHWjGIPgFQPKIrEDACeCqzwgUls60wMK0wMOU4AWnBRH8TyCdWiPoobSWGEnoO/DjlARWUhaopPxM4dNugpQOESmtVbwAAAAASUVORK5CYII=);
  }
  .body-table-container::-webkit-scrollbar-button:vertical:increment {
      background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAVklEQVQ4T93S0QoAEAwF0OvLzZ+LwrCN5Y0XJfeoawGPKzzm8RFAAKKzjwSAeAcepIbLg2uJN0gPS0A5s5AprAEasoUtYEXE8AloCN+3j/poEp1DOK5nfmcNES1z5SIAAAAASUVORK5CYII=);
  }

  .body-table-container::-webkit-scrollbar-button:vertical:decrement {
      background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAVUlEQVQ4T2NkoBAwUqifYfAb0AD1IozG8DE+L4A01UN1NDIwMGA1BJcByJphtmI1BJsB2DTjNATdAHyasRqCbAAxmjEMgRlAimYUQwZ/QiKYVQbeCwBFhQ0RcSHRhgAAAABJRU5ErkJggg==);
  }
  .body-table-container::-webkit-scrollbar-track {
      background: #f8f8f8;
      -webkit-box-shadow: inset 1px 1px 2px rgba(0,0,0,0.1);
  }
  .body-table-container::-webkit-scrollbar-thumb {
      background: #aaa;
      -webkit-box-shadow: inset 1px 1px 2px rgba(0,0,0,0.2);
    border-radius: 5px;
  }
  .body-table-container::-webkit-scrollbar-thumb:hover {
      background: #989898;
  }
  .body-table-container::-webkit-scrollbar-thumb:active {
      background: #808080;
      -webkit-box-shadow: inset 1px 1px 2px rgba(0,0,0,0.3);
  }
</style>

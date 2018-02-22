import _ from 'lodash'
import $ from 'jquery'
import json2csv from 'json2csv'
import FileSaver from 'file-saver'

export const pixelize = function (value) {
  return (_.isNumber(value) ? value : 0) + 'px'
}

export const flattenTree = function (tree, childrenFields) {
  if (!childrenFields || !(childrenFields instanceof Array)) {
    childrenFields = []
  }
  const parseRecursively = function ({ tree, list, treeLevel }) {
    tree.forEach(node => {
      list.push(node)
      let childrenField = childrenFields.length > treeLevel ? childrenFields[treeLevel] : 'children'
      let childNodes = node[childrenField]
      if (childNodes && childNodes instanceof Array) {
        parseRecursively({
          tree: childNodes,
          treeLevel: treeLevel + 1,
          list
        })
      }
    })
  }
  let list = []
  parseRecursively({
    tree,
    list,
    treeLevel: 0
  })
  return list
}

export const UtilMixin = {
  methods: {
    pixelize
  }
}

export const exportCSV = function ({ data, fields, labels, fileName }) {
  let csvData = json2csv({
    data,
    fields,
    fieldNames: labels
  })
  let csvFile = new window.File([csvData], (fileName || 'export') + '.csv', { type: 'text/csv;charset=utf-8' })
  FileSaver.saveAs(csvFile)
}

export const getVisibleContentHeight = function () {
  let winHeight = $(window).height()
  let headerHeight = $('#app>.wrapper>header.main-header').outerHeight()
  let footerHeight = $('#app>.wrapper>footer.main-footer').outerHeight()
  let contentHeaderHeight = $('#app>.wrapper>.content-wrapper>.content-header').outerHeight()
  let contentPadding = parseInt($('#app>.wrapper>.content-wrapper>.content').css('padding-top')) + parseInt($('#app>.wrapper>.content-wrapper>.content').css('padding-bottom'))
  return winHeight - headerHeight - footerHeight - contentHeaderHeight - contentPadding
}

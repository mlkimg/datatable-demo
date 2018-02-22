import _ from 'lodash'

export const normalizeDatatableData = ({ data, idFields, childrenFieldGroups, normalizedIdField, normalizedChildrenField }) => {
  if (!normalizedIdField) {
    normalizedIdField = 'id'
  }
  if (!normalizedChildrenField) {
    normalizedChildrenField = 'children'
  }
  if (!idFields) {
    idFields = []
  }
  if (!childrenFieldGroups) {
    childrenFieldGroups = []
  }
  const groupNormalize = function ({ tree, groupLevel, childrenFields, children, parentValues }) {
    // console.log(_.cloneDeep(parentValues))
    if (groupLevel === undefined) {
      groupLevel = 0
    }
    if (children === undefined) {
      children = []
    }
    let childrenField = childrenFields[groupLevel]
    let list = tree[childrenField] || []
    if (groupLevel === childrenFields.length) {
      children.push(_.omit(parentValues, childrenFields))
    } else {
      list.forEach(tree => {
        groupNormalize({
          tree,
          groupLevel: groupLevel + 1,
          childrenFields,
          children,
          parentValues: { ...parentValues, ...tree }
        })
      })
    }
    if (groupLevel === 0) {
      delete tree[childrenField]
    }
    return children
  }
  const normalize = function ({ list, treeLevel }) {
    let idField = treeLevel < idFields.length ? idFields[treeLevel] : normalizedIdField
    let childrenFields = treeLevel < childrenFieldGroups.length ? childrenFieldGroups[treeLevel] : [normalizedChildrenField]
    list.forEach(tree => {
      let id = tree[idField]
      // delete tree[idField]
      let children = groupNormalize({ tree, childrenFields })
      if (children.length > 0) {
        tree[normalizedChildrenField] = children
        normalize({ list: children, treeLevel: treeLevel + 1 })
      }
      tree[normalizedIdField] = id
    })
  }
  normalize({ list: data, treeLevel: 0 })
}

export const datatableDataDescentClone = function ({ data }) {
  const recursiveClone = function ({ list, parentValues }) {
    return list.map(item => {
      if (parentValues) {
        item = { ...parentValues, ...item }
      }
      if (item.children) {
        item.children = recursiveClone({ list: item.children, parentValues: _.omit(item, ['id', 'children']) })
      }
      return item
    })
  }
  data = recursiveClone({ list: data })
}

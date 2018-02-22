import _ from 'lodash'

export const pixelize = function (value) {
  return (_.isNumber(value) ? value : 0) + 'px'
}

export const flattenTree = function (tree) {
  const parseRecursively = function ({ tree, list }) {
    tree.forEach(node => {
      list.push(node)
      if (node.children && node.children instanceof Array) {
        parseRecursively({
          tree: node.children,
          list
        })
      }
    })
  }
  let list = []
  parseRecursively({
    tree,
    list
  })
  return list
}

export const generateBackgroundForegroundGrayPairs = function (numberOfPairs) {
  function rgb (grayscale) {
    return 'rgb(' + grayscale + ',' + grayscale + ',' + grayscale + ')'
  }
  let nPairs = numberOfPairs
  if (nPairs < 4) {
    nPairs = 4
  }
  const bgDark = 144
  // const bgDark = 59
  // const bgBright = 190
  const bgBright = 245
  const fgDark = 51
  const fgBright = 245
  const step = Math.round((bgBright - bgDark) / (nPairs - 1))
  let bgGray = bgDark
  let grayscalePairs = []
  for (let level = 0; level < nPairs; level++) {
    if (bgGray > bgBright) {
      bgGray = bgBright
    }
    let fgGray = bgGray > 170 ? fgDark : fgBright
    grayscalePairs.push([rgb(bgGray), rgb(fgGray)])
    bgGray += step
  }
  return grayscalePairs.slice(nPairs - numberOfPairs)
}

export const getAllLeafNodes = function (list) {
  const recursiveExtract = function (list, result) {
    list.forEach(item => {
      if (item.children) {
        recursiveExtract(item.children, result)
      } else {
        result.push(item)
      }
    })
  }
  let result = []
  recursiveExtract(list, result)
  return result
}

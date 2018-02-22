<template>
  <div class="row">
    <div class="col-md-12">
      <div class="pull-left">
        {{ this.labelTotal + ': ' + this.total + this.labelTotalNumberUnit }}
      </div>
      <div class="pull-right">
        <div class="pull-left">
          <div class="form-inline">
            <div class="form-group">
              <div class="input-group">
                <select class="form-control input-sm" v-model="rowsPerPage" @change="onRowsPerPageSelected">
                  <option v-for="rows in rowsPerPageOptions" :value="rows">{{ rows }}</option>
                </select>
                <div class="input-group-addon"><strong>{{ labelRowsPerPage }}</strong></div>
              </div>
            </div>
          </div>
        </div>
        <ul class="pagination pagination-sm">
          <li :class="currentPage === 1 ? 'disabled' : ''"><a href="#" aria-label="Previous" @click.prevent="currentPage > 1 ? currentPage-- : currentPage"><span aria-hidden="true">&lt;</span></a></li>
          <li v-for="page in pages" :class="pageClass(page)">
            <a href="#" @click.prevent="onPageSelect(page)">
              {{ isInteger(page) ? page : '...' }}
            </a>
          </li>
          <li :class="currentPage === numberOfPages ? 'disabled' : ''"><a href="#" aria-label="Next" @click.prevent="currentPage < numberOfPages ? currentPage++ : currentPage"><span aria-hidden="true">&gt;</span></a></li>
        </ul>
        <div class="form-inline pull-right">
          <div class="form-group">
            <div class="input-group">
              <div class="input-group-addon"><strong>{{ labelGoTo }}</strong></div>
              <input type="number" class="form-control input-sm" min="1" :max="numberOfPages" v-model="toPage" @input="onToPageInput"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import _ from 'lodash'
  // import Cleave from 'cleave.js'

  const defaultRowsPerPageOptions = [10, 20, 50]
  const prevMore = 'previous more'
  const nextMore = 'next more'
  export default {
    props: {
      options: {
        type: Object,
        default () { return {} }
      }
    },
    data () {
      return {
        currentPage: 1,
        rowsPerPage: 10,
        numberOfPages: 1,
        rowsPerPageOptions: defaultRowsPerPageOptions,
        toPage: 1,
        labelGoTo: 'Go to',
        labelRowsPerPage: 'rows / page',
        labelTotal: 'Total',
        labelTotalNumberUnit: '',
        total: 0
      }
    },
    computed: {
      pages () {
        const radius = 2

        const currentPage = Number(this.currentPage)
        const numberOfPages = Number(this.numberOfPages)

        let showPrevMore = false
        let showNextMore = false

        let min = currentPage - radius
        let max = currentPage + radius

        const pages = []

        if (min > 3) {
          showPrevMore = true
        } else if (min <= 0) {
          max += (1 - min)
        }
        if (max < numberOfPages - 2) {
          showNextMore = true
        } else if (max > numberOfPages) {
          min -= max - numberOfPages
          if (min > 3) {
            showPrevMore = true
          }
        }

        if (numberOfPages < 9) {
          showPrevMore = showNextMore = false
        }

        if (showPrevMore === false) {
          min = 1
        }
        if (showNextMore === false) {
          max = numberOfPages
        }

        if (showPrevMore) {
          pages.push(1)
          pages.push(prevMore)
        }

        for (let page = min; page <= max; page++) {
          pages.push(page)
        }

        if (showNextMore) {
          pages.push(nextMore)
          pages.push(numberOfPages)
        }
        return pages
      }
    },
    watch: {
      currentPage () {
        this.toPage = this.currentPage
        this.onChanged()
      },
      rowsPerPage (newVal, oldVal) {
        this.onChanged()
      },
      // 'options.numberOfPages': function (numberOfPages) {
      //   if (_.isInteger(numberOfPages)) {
      //     this.numberOfPages = numberOfPages
      //   }
      // },
      // 'options.rowsPerPage': function (rowsPerPage) {
      //   if (_.isInteger(rowsPerPage)) {
      //     this.rowsPerPage = rowsPerPage
      //   }
      // },
      options (newVal, oldVal) {
        let { currentPage, rowsPerPage, numberOfPages, total } = this.options
        if (_.isInteger(currentPage)) {
          this.currentPage = currentPage
        }
        if (_.isInteger(numberOfPages)) {
          this.numberOfPages = numberOfPages
        }
        if (_.isInteger(rowsPerPage)) {
          this.rowsPerPage = rowsPerPage
        }
        if (_.isInteger(total)) {
          this.total = total
        }
      }
    },
    methods: {
      applyOptions () {
        for (let property in this.options) {
          if (this[property] !== undefined) {
            this[property] = _.isObject(this.options[property]) ? _.cloneDeep(this.options[property]) : this.options[property]
          }
        }

        if (!this.rowsPerPageOptions.length) {
          this.rowsPerPageOptions = defaultRowsPerPageOptions
        }
        this.rowsPerPage = this.rowsPerPageOptions[0]

        if (!_.isInteger(this.numberOfPages)) {
          this.numberOfPages = 1
        }

        if (!_.isInteger(this.currentPage) || this.currentPage > this.numberOfPages) {
          this.currentPage = 1
        }
      },
      pageClass (page) {
        return page === this.currentPage ? 'active' : ''
      },
      onPageSelect (page) {
        if (page === prevMore) {
          let prevMoreItemIdx = this.pages.indexOf(page)
          this.currentPage = this.pages[prevMoreItemIdx + 1] - 1
        } else if (page === nextMore) {
          let nextMoreItemIdx = this.pages.indexOf(page)
          this.currentPage = this.pages[nextMoreItemIdx - 1] + 1
        } else {
          page = _.toInteger(page)
          if (_.isInteger(page) && page >= 1 && page <= this.numberOfPages) {
            this.currentPage = page
          }
        }
      },
      isInteger (number) {
        return _.isInteger(number)
      },
      onToPageInput: _.debounce(function () {
        if (this.toPage >= 1 && this.toPage <= this.numberOfPages) {
          this.currentPage = this.toPage
        } else {
          this.toPage = this.currentPage
        }
      }, 500),
      onChanged () {
        this.$emit('change', {
          page: this.currentPage,
          rowsPerPage: this.rowsPerPage
        })
      },
      onRowsPerPageSelected () {
        this.$emit('rows-per-page-selected', { rowsPerPage: this.rowsPerPage })
      }
    },
    created () {
      this.applyOptions()
    }
  }
</script>

<style scoped>
  .pagination {
    margin: 0;
  }
</style>
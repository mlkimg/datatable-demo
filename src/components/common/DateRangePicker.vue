<template>
  <div class="input-group" style="width: 100%;">
    <div v-if="showAddon" class="input-group-addon"><i class="fa fa-calendar"></i></div>
    <input type="text" class="form-control input-sm pull-right" ref="input">
  </div>
</template>

<script>
  // require('bootstrap-daterangepicker')
  // require('bootstrap-daterangepicker/daterangepicker.css')
  import 'boolie-bootstrap-daterangepicker/daterangepicker.js'
  import 'boolie-bootstrap-daterangepicker/daterangepicker-bs3.css'
  import $ from 'jquery'
  import moment from 'moment'
  export default {
    props: {
      value: {
        type: Object,
        default () {
          // return {
          //   from: moment().subtract(1, 'days').format('YYYY-MM-DD'),
          //   to: moment().format('YYYY-MM-DD')
          // }bb
          return null
        }
        // ,
        // validator (obj) {
        //   let isString = (value) => typeof value === 'string' || value instanceof String
        //   let isDateString = (value) => isString(value) && moment(value).isValid()
        //   return isDateString(obj.from) && isDateString(obj.to)
        // }
      },
      showAddon: {
        type: Boolean,
        default: false
      },
      autoApply: {
        type: Boolean,
        default: false
      }
    },
    watch: {
      value () {
        if (this.value) {
          const {from, to} = this.value
          $(this.$refs.input).data('daterangepicker').setStartDate(moment(from))
          $(this.$refs.input).data('daterangepicker').setEndDate(moment(to))
        } else {
          $(this.$refs.input).val('')
        }
      }
    },
    mounted () {
      const dateRange = this.value ? {
        startDate: moment(this.value.from),
        endDate: moment(this.value.to)
      } : {}
      $(this.$refs.input).daterangepicker({
        // opens: 'left',
        locale: { cancelLabel: 'Clear' },
        autoApply: this.autoApply,
        autoUpdateInput: true,
        ...dateRange
      }, (start, end) => {
        this.$emit('input', {
          from: start.format('YYYY-MM-DD'),
          to: end.format('YYYY-MM-DD')
        })
      })
      $(this.$refs.input).on('apply.daterangepicker', (event, picker) => {
        this.$emit('input', {
          from: picker.startDate.format('YYYY-MM-DD'),
          to: picker.endDate.format('YYYY-MM-DD')
        })
      })
      $(this.$refs.input).on('cancel.daterangepicker', (event, picker) => {
        $(this.$refs.input).val('')
        this.$emit('input', null)
      })
    },
    beforeDestroy () {
      $(this.$refs.input).off().daterangepicker('destroy')
    }
  }
</script>

<style scoped>
  input {
    height: 28px;
  }
</style>
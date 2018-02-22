<template>
  <div>
    <div v-if="embedded" ref="panel"></div>
    <input v-else type="text" class="form-control input-sm" ref="input">
  </div>
</template>

<script>
  import $ from 'jquery'
  import moment from 'moment'
  import 'bootstrap-datepicker'
  import 'bootstrap-datepicker/dist/css/bootstrap-datepicker3.min.css'
  export default {
    props: {
      value: {
        type: String,
        default () { return null }
      },
      embedded: {
        type: Boolean,
        default: false
      },
      showClearBtn: {
        type: Boolean,
        default: true
      },
      options: {
        type: Object,
        default () { return {} }
      }
    },
    computed: {
      datepickerEl () {
        return this.embedded ? this.$refs.panel : this.$refs.input
      }
    },
    watch: {
      value () {
        this.update()
      },
      options () {
        $(this.datepickerEl).datepicker('destroy')
        this.init()
      }
    },
    methods: {
      update () {
        $(this.datepickerEl).datepicker('update', this.value)
      },
      init () {
        $(this.datepickerEl).datepicker({
          ...this.options,
          format: 'yyyy-mm-dd',
          autoclose: true,
          clearBtn: this.showClearBtn
        }).on('changeDate', ({ date }) => {
          let dateString = date ? moment(date).format('YYYY-MM-DD') : ''
          this.$emit('input', dateString)
        })
        if (this.value) {
          this.update()
        }
      }
    },
    mounted () {
      this.init()
    },
    destroyed () {
      $(this.datepickerEl).datepicker('destroy')
    }
  }
</script>
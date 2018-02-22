<i18n>
{
  "en": {
    "freezePane": "Freeze Pane",
    "tablePreference": "User Table Preference",
    "reset": "Reset",
    "save": "Save",
    "columnSettingTips": "Please drag a single column to rearrange the display order of columns in this table."
  }
}
</i18n>

<template>
  <modal :show="showModal" @show="showModal = true" @hide="showModal = false" :dialog-style="dialogStyle">
    <div class="header">
      <h4 style="display: inline-block;">{{ $t('tablePreference') }}</h4>
      <span class="pull-right" style="cursor: pointer;" @click="showModal = false">X</span>
    </div>
    <div class="content">
      <div class="row">
        <div class="col-md-12">
          <div class="row">
            <div class="col-md-12">
                <div class="section-header">
                  {{ $t('columnSettingTips') }}
                  <div class="pull-right">
                    <button class="btn btn-xs" @click="onResetBtnClicked">{{ $t('reset') }}</button>
                    <button class="btn btn-primary btn-xs" @click="onSaveBtnClicked">{{ $t('save') }}</button>
                  </div>
                </div>
            </div>
          </div>
          <div class="row">
            <div class="col-md-12">
                <columns
                  :columns="newColumns"
                  :fixed-to-column-idx="newFixedToColumnIdx"
                  :label-fixed-to="$t('freezePane')"
                  @change="onColumnsChanged"
                  @fixed-to-column-idx-changed="newFixedToColumnIdx = $event.fixedToColumnIdx"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  </modal>
</template>

<script>
  import _ from 'lodash'
  import { pixelize, flattenTree } from '../util'
  import Modal from '../../Modal'
  import Columns from './Columns'
  import en from '../i18n/en'

  export default {
    locales: {
      en
    },
    components: {
      Modal,
      Columns
    },
    props: {
      show: {
        type: Boolean,
        default: false
      },
      columns: {
        type: Array,
        required: true
      },
      fixedToColumnIdx: {
        type: Number,
        required: true
      }
    },
    data () {
      return {
        showModal: false,
        dialogStyle: {
          width: pixelize(600),
          height: pixelize(520),
          overflow: 'auto'
        },
        newColumns: null,
        newFixedToColumnIdx: -1,
        saved: false
      }
    },
    watch: {
      show () {
        this.showModal = this.show
      },
      showModal () {
        this.$emit(this.showModal ? 'show' : 'hide')
        if (!this.showModal) {
          this.saved = false
          this.newColumns = _.cloneDeep(this.columns)
          this.newFixedToColumnIdx = this.fixedToColumnIdx
        }
      },
      columns () {
        this.newColumns = _.cloneDeep(this.columns)
      },
      fixedToColumnIdx () {
        this.newFixedToColumnIdx = this.fixedToColumnIdx
      }
    },
    created () {
      this.showModal = this.show
      this.newColumns = _.cloneDeep(this.columns)
      this.newFixedToColumnIdx = this.fixedToColumnIdx
    },
    methods: {
      onColumnsChanged ({ id, property, value }) {
        if (!id) {
          this.newColumns = _.cloneDeep(value)
        } else {
          // this.newColumns = this.newColumns ?  : _.cloneDeep(this.columns)
          let columnToBeChanged = flattenTree(this.newColumns).find(column => column.id === id)
          columnToBeChanged[property] = _.cloneDeep(value)
          this.newColumns = _.cloneDeep(this.newColumns)
        }
      },
      onResetBtnClicked () {
        this.$emit('settings-reset-clicked')
      },
      onSaveBtnClicked () {
        if (this.newColumns) {
          let newColumns = this.newColumns
          this.$emit('columns-changed', { newColumns })
        }
        let fixedToColumnIdx = this.newFixedToColumnIdx
        this.$emit('fixed-to-column-idx-changed', { fixedToColumnIdx })
        this.saved = true
        this.showModal = false
      }
    }
  }
</script>

<style scoped>
  * {
    font-family: 'Roboto Condensed', sans-serif;
  }
  .header {
    font-weight: bold;
  }
  .content {
    padding: 10px 0;
  }
  .section-header {
    font-weight: 600;
  }
  .section-header a {
    font-weight: normal;
    text-decoration: underline;
  }
</style>
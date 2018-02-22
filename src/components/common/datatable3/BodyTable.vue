<template>
  <div :style="containerStyle">
    <table :class="tableClass" :style="{ top: clusterizedTableOffsetY + 'px' }">
      <tbody>
        <tr>
          <!-- <td class="no-padding no-border" style="height: 0;"></td> -->
          <measurable-cell/>
          <td v-if="showCheckbox" class="h-center no-padding no-border" :style="checkboxColumnStyle"></td>
          <td v-if="isTree" class="no-padding no-border" :style="expanderColumnStyle"></td>
          <td v-for="column in columns" class="no-border" :style="basicColumnStyle(column)"/>
        </tr>
        <tr v-for="row in rows" v-if="row.show" :style="rowStyle(row)" @mouseenter="onRowMouseenter(row)" @mouseleave="onRowMouseleave(row)">
          <!-- <td class="no-padding"></td> -->
          <measurable-cell :height="rowHeight"/>
          <td v-if="showCheckbox" class="h-center v-center no-padding" :style="checkboxColumnStyle">
            <input type="checkbox" :style="checkboxStyle(row)" v-model="row.selected" @click="onRowCheckboxClick(row, $event)">
          </td>
          <td v-if="isTree" class="h-center v-center no-padding" :style="expanderColumnStyle">
            <expander v-if="!row.isLeaf" :style="expanderStyle(row)" v-model="row.expand" @click="onRowExpanderClick(row)"/>
          </td>
          <cell v-for="column in columns" :column="column" :row-data="row.data" :row-height="rowHeight"/>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  import $ from 'jquery'
  import PropertyMixin from './PropertyMixin'
  import StyleMixin from './StyleMixin'
  import Cell from './Cell'
  import Expander from './Expander'
  import MeasurableCell from './MeasurableCell'
  import { pixelize } from './util'

  export default {
    mixins: [
      PropertyMixin,
      StyleMixin
    ],
    components: {
      Cell,
      Expander,
      MeasurableCell
    },
    props: {
      columns: {
        type: Array,
        required: true
      },
      rows: {
        type: Array,
        required: true
      },
      isFixed: {
        type: Boolean,
        default: false
      },
      rowHeight: {
        type: Number,
        required: true
      },
      tableWidth: {
        type: Number,
        required: true
      },
      tableHeight: {
        type: Number,
        required: true
      },
      clusterizedTableOffsetY: {
        type: Number,
        required: true
      }
    },
    computed: {
      containerStyle () {
        return {
          width: pixelize(Math.floor(this.tableWidth)),
          height: pixelize(this.tableHeight),
          position: 'relative'
        }
      }
    },
    methods: {
      onRowCheckboxClick (row, event) {
        if (event.target) {
          $(event.target).blur()
        }
        this.$emit('row-checkbox-click', { row })
      },
      onRowExpanderClick (row) {
        this.$emit('row-expander-click', { row })
      },
      onRowMouseenter (row) {
        this.$emit('mouseover-on-row', { row })
      },
      onRowMouseleave (row) {
        this.$emit('mouseleave-on-row', { row })
      }
    }
  }
</script>

<style scoped>
  .no-padding {
    padding: 0;
  }
  .no-border {
    border: 0;
  }
  .h-center {
    text-align: center;
  }
  .v-center {
    vertical-align: middle;
  }
  table {
    margin-bottom: 0;
    position: absolute;
  }
</style>
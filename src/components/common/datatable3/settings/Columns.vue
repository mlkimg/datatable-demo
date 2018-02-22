<template>
  <ul class="list-group">
    <draggable :list="dndColumns" @start="onDragged" @end="onDropped">
      <li v-for="(dndColumn, columnIdx) in dndColumns" class="list-group-item" :class="dndWidgetClass(dndColumn, columnIdx)">
        <span>
          {{ dndColumn.label }}
          <input v-if="!dndColumn.isFixedToHandler && !dndColumn.children" type="checkbox" class="pull-right" :value="dndColumn.id" v-model="visibleColumnIds" @change="onVisibilityChanged(dndColumn)">
        </span>
        <!-- <columns v-if="dndColumn.children" :columns="dndColumn.children" :parent-column-id="dndColumn.id" @change="onChildColumnsChanged"> -->
      </li>
    </draggable>
  </ul>
</template>

<script>
  import _ from 'lodash'
  import Draggable from 'vuedraggable'

  export default {
    // name: 'columns',
    components: {
      Draggable
    },
    props: {
      columns: {
        type: Array,
        required: true
      },
      parentColumnId: {
        type: String,
        default: null
      },
      fixedToColumnIdx: {
        type: Number,
        default: -1
      },
      labelFixedTo: {
        type: String,
        default: 'Freeze Pane'
      }
    },
    data () {
      return {
        dndColumns: [],
        visibleColumnIds: [],
        draggingColumnId: null
      }
    },
    computed: {
      rootClass () {
        return {
          root: !this.parentColumnId
        }
      }
    },
    watch: {
      columns () {
        this.updateDndColumns()
      }
    },
    methods: {
      updateDndColumns () {
        this.dndColumns = _.cloneDeep(this.columns)
        this.dndColumns.forEach(dndColumn => {
          if (!dndColumn.hidden && this.visibleColumnIds.indexOf(dndColumn.id) === -1) {
            this.visibleColumnIds.push(dndColumn.id)
          }
        })
        if (!this.parentColumnId) {
          this.dndColumns.splice(this.fixedToColumnIdx + 1, 0, { label: this.labelFixedTo, isFixedToHandler: true })
        }
      },
      dndWidgetClass (dndColumn, columnIdx) {
        return {
          'fixed-to-handler': dndColumn.isFixedToHandler,
          'dragging': dndColumn.id === this.draggingColumnId
        }
      },
      onDragged (event) {
        // console.log(event)
        let dndColumn = this.dndColumns[event.oldIndex]
        if (!dndColumn.isFixedToHandler) {
          this.draggingColumnId = dndColumn.id
        }
      },
      onDropped (event) {
        // console.log('onDropped')
        // console.log(event)
        this.draggingColumnId = null
        let fixedToColumnIdx = this.dndColumns.findIndex(dndColumn => dndColumn.isFixedToHandler) - 1
        if (!this.parentColumnId && fixedToColumnIdx !== this.fixedToColumnIdx) {
          this.$emit('fixed-to-column-idx-changed', {
            fixedToColumnIdx
          })
        }
        let columns = this.dndColumns.filter(dndColumn => !dndColumn.isFixedToHandler)
        if (!columns.every((column, idx) => {
          return this.columns.find(origin => origin.id === column.id) === idx
        })) {
          this.$emit('change', {
            id: this.parentColumnId,
            property: 'children',
            value: this.dndColumns.filter(dndColumn => !dndColumn.isFixedToHandler)
          })
        }
      },
      onVisibilityChanged (dndColumn) {
        this.$emit('change', {
          id: dndColumn.id,
          property: 'hidden',
          value: this.visibleColumnIds.indexOf(dndColumn.id) === -1
        })
      },
      onChildColumnsChanged (event) {
        this.$emit('change', event)
      }
    },
    created () {
      this.updateDndColumns()
    }
  }
</script>

<style scoped>
  /*ul {
    padding-left: 30px;
  }
  li {
    list-style-type: none;
    margin:0;
    padding:5px 5px 0 0;
    position:relative;
    font-size: 12px;
  }
  li::before, li::after {
    content:'';
    left:-25px;
    position:absolute;
    right:auto;
  }
  li::before {
    border-left:1px solid #999;
    bottom:50px;
    height:100%;
    top:0;
    width:1px
  }
  li::after {
    border-top: 1px solid #999;
    height: 20px;
    top: 18px;
    width: 25px;
  }
  li>span {
    -moz-border-radius:5px;
    -webkit-border-radius:5px;
    border:1px solid #999;
    border-radius:5px;
    display:inline-block;
    padding:3px 8px;
    text-decoration:none;
    cursor: move;
  }
  li>span>input {
    margin-left: 10px;
  }
  li:last-child::before {
    height: 18px;
  }*/
  .list-group-item.fixed-to-handler {
    background: rgb(229, 231, 233);
    color: gray;
    text-align: center;
  }
  .list-group-item {
    padding: 3px 10px;
    font-weight: normal;
    color: white;
    background: #1587d0;
  }
  .dragging {
    background: #ffbd00;
  }
</style>
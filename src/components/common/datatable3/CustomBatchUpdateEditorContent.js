export default {
  props: {
    renderFunction: {
      type: Function,
      required: true
    },
    showEditorInput: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      show: false
    }
  },
  watch: {
    showEditorInput () {
      this.show = this.showEditorInput
    },
    show () {
      this.$emit('show-editor-input-changed', this.show)
    }
  },
  methods: {
    close () {
      this.show = false
    }
  },
  render (h) {
    return (
      this.renderFunction(h, { close: this.close })
    )
  }
}

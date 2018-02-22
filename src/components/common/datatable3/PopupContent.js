export default {
  props: {
    renderContent: {
      type: Function,
      required: true
    }
  },
  render (h) {
    return (
      this.renderContent(h)
    )
  }
}

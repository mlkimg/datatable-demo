import _ from 'lodash'
import column from './column'

export default {
  label: 'Not Specify',
  children: [ _.cloneDeep(column) ],
  renderHeaderCell (h) {
    return (
      <div>
        { this.label }
      </div>
    )
  }
}

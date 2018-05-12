import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import createResizeDetector from 'element-resize-detector'

const erd = createResizeDetector({ strategy: 'scroll' })

class Contain extends PureComponent {
  static propTypes = {
    children: PropTypes.element.isRequired,
    ratio: PropTypes.number.isRequired,
  }

  state = {
    width: null,
    height: null,
  }

  constructor (props) {
    super(props)

    this.container = React.createRef()
  }

  componentDidMount = () => {
    const container = this.getContainer()

    erd.listenTo(container, () => {
      const state = {}
      const { clientWidth, clientHeight } = this.getContainer()
      const { ratio } = this.props
      const width = Math.min(clientWidth, clientHeight * ratio)
      const height = Math.min(clientHeight, clientWidth / ratio)
      const portrait = clientWidth > clientHeight

      if (portrait) {
        state.width = width
        state.height = width / ratio
      } else {
        state.width = height * ratio
        state.height = height
      }

      this.setState(state)
    })
  }

  getContainer = () => this.container.current

  render () {
    const { children, ...props } = this.props
    const { width, height } = this.state

    return (
      <div {...props} ref={this.container}>
        <div style={{ width, height }}>
          {children}
        </div>
      </div>
    )
  }
}

export default Contain

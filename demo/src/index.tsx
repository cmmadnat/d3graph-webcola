import { Component } from 'react'
import * as React from 'react'
import { render } from 'react-dom'
const data = require('./miserable.json')

import Example from '../../src'

class Demo extends Component {
  render() {

    return (
      <div>
        <h1>react-nwb-test Demo</h1>
        <Example graph={data} />
      </div>
    )
  }
}

render(<Demo />, document.querySelector('#demo'))

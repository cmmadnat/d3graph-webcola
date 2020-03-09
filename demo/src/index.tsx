import { Component } from 'react'
import * as React from 'react'
import { render } from 'react-dom'
import Example, { convert } from '../../src'


import './fontello-fa3b80f1/css/fontello-embedded.css'

import icons from './graph-meta-data'
import { RawData } from '../../src/raw-data-props'
const data: RawData = require('./demo.json')
// const data = require('./miserable.json')

class Demo extends Component {
  render() {
    const data2 = convert(data)
    return (
      <div>
        <h1>react-nwb-test Demo</h1>
        <i className="icon icon-p-1"></i>
        <Example highlights={['1328']} graph={data2} icons={icons} />
      </div>
    )
  }
}

render(<Demo />, document.querySelector('#demo'))

import { Component } from 'react'
import * as React from 'react'
import { render } from 'react-dom'
import './fontello-fa3b80f1/css/fontello-embedded.css'

import icons from './graph-meta-data'
const data = require('./miserable.json')

import Example from '../../src'

class Demo extends Component {
  render() {

    return (
      <div>
        <h1>react-nwb-test Demo</h1>
        <i className="icon icon-p-1"></i>
        <Example graph={data} icons={icons} />
      </div>
    )
  }
}

render(<Demo />, document.querySelector('#demo'))

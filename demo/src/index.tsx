import { Component } from 'react'
import * as React from 'react'
import { render } from 'react-dom'
import Example, { convert } from '../../src'

import './fontello-fa3b80f1/css/fontello-embedded.css'
import '../../src/style.css'

import icons from './graph-meta-data'
import { RawData2 } from '../../src/raw-data-props2'
import './reset.css'

const data: RawData2 = require('./demo3.json')

class Demo extends Component {
  render() {
    const data3 = {
      result: {
        nodes: data.result.nodes.map(it => ({
          ...it, properties:
            // @ts-ignore
            { name: it.properties.full_name ? it.properties.full_name : it.properties.event_title }
        })),
        relationships: data.result.relationships
      }
    }
    // @ts-ignore
    const data2 = convert(data3, icons)
    return (
      <div className='hundredP'>
        <h1>react-nwb-test Demo</h1>
        <i className="icon icon-p-1"></i>
        <Example highlights={['1328']} graph={data2} icons={icons} nodeRightClick={(node) => {
          console.log(node)
        }} nodeDoubleClick={() => {
          console.log('dblclick')
        }} relationshipDoubleClick={(l) => {
          console.log(l)
        }} />
      </div>
    )
  }
}

render(<Demo />, document.querySelector('#demo'))

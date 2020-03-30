import * as React from 'react'
import { useState, useEffect } from 'react'
import { render } from 'react-dom'
import Example, { convert } from '../../src'

import './fontello-fa3b80f1/css/fontello-embedded.css'
import '../../src/style.css'

import icons from './graph-meta-data'
import { RawData2 } from '../../src/raw-data-props2'
import './reset.css'
import { GraphObject } from '../../src/D3Component'

const rawData: RawData2 = require('./demo3.json')

const Demo = () => {
  const [data, setData] = useState<GraphObject>({ nodes: [], links: [], groups: [] })
  useEffect(() => {
    const data3 = {
      result: {
        nodes: rawData.result.nodes.map(it => ({
          ...it, properties:
            // @ts-ignore
            { name: it.properties.full_name ? it.properties.full_name : it.properties.event_title }
        })),
        relationships: rawData.result.relationships
      }
    }
    const data2 = convert(data3, icons)
    setData(data2)
  }, [])
  // @ts-ignore
  return (
    <div className='hundredP'>
      <h1>react-nwb-test Demo</h1>
      <i className="icon icon-p-1"></i>
      <Example highlights={['1328']} graph={data} icons={icons} nodeRightClick={(node) => {
        console.log(node)
      }} nodeDoubleClick={() => {
        console.log('dblclick')
      }} relationshipDoubleClick={(l) => {
        console.log(l)
      }} />
    </div>
  )
}

render(<Demo />, document.querySelector('#demo'))

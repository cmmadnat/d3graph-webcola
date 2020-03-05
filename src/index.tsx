import { Component } from 'react'
import * as React from 'react'
import Graph, { GraphObject } from './D3Component'

export interface Props {
  graph: GraphObject
}
export default class extends Component<Props> {

  render() {
    const { graph } = this.props
    return (
      <Graph graph={graph} />
    )
  }
}

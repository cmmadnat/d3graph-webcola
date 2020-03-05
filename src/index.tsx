import { Component } from 'react'
import * as React from 'react'
import Graph, { GraphObject, Icons } from './D3Component'

export interface Props {
  graph: GraphObject
  icons: Icons
}
export default class extends Component<Props> {

  render() {
    const { graph, icons } = this.props
    return (
      <Graph graph={graph} icons={icons} />
    )
  }
}

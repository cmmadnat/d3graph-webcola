import { Component } from 'react'
import * as React from 'react'
import Graph, { GraphObject, Icons, Node, Link } from './D3Component'
import { RawData } from './raw-data-props'
import * as _ from 'lodash'

export interface Props {
  graph: GraphObject
  icons: Icons
}
export const convert = (data: RawData) => {

  const groupString = data.nodes.map(it => it.labels[it.labels.length - 1])
  const groupNoDuplicate = _.uniq(groupString)
  const nodesId = data.nodes.map(it => it.id)

  const output: GraphObject = {
    nodes: data.nodes.map(it => {
      const g = groupNoDuplicate.indexOf(it.labels[it.labels.length - 1])
      const d: Node = {
        icon: it.labels[it.labels.length - 1],
        name: it.properties.event_title ? it.properties.event_title : it.properties.full_name ? it.properties.full_name : 'untitled',
        group: g
      }
      return d
    }),
    links: data.relationships.map(it => {
      const l: Link = {
        source: nodesId.indexOf(it.source),
        target: nodesId.indexOf(it.target),
        value: 4
      }
      return l
    })
  }
  return output
}
export default class extends Component<Props> {

  render() {
    const { graph, icons } = this.props
    return (
      <Graph graph={graph} icons={icons} />
    )
  }
}

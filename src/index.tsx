import { Component } from 'react'
import * as React from 'react'
import Graph, { GraphObject, Icons, ModdedNode, ModdedLink, } from './D3Component'
import { RawData2 } from './raw-data-props2'

export interface Props {
  graph: GraphObject
  icons: Icons
  highlights: string[]
  nodeRightClick?: (node: ModdedNode) => void
  nodeDoubleClick?: (node: ModdedNode) => void
  relationshipDoubleClick?: (link: ModdedLink<number>) => void
}
export const convert = (data: RawData2, icons: Icons) => {

  const output: GraphObject = {
    nodes: data.result.nodes.map(it => {
      const d: ModdedNode = {
        id: it.id + '',
        icon: it.labels[it.labels.length - 1],
        name: it.properties.name,
        color: icons.labelColorMapping[it.labels.length - 1],
        x: 0, y: 0
      }
      return d
    }),
    links: data.result.relationships.map(it => {
      const source = data.result.nodes.filter(it2 => it2.id === it.source).pop()
      const target = data.result.nodes.filter(it2 => it2.id === it.target).pop()


      // @ts-ignore
      const l: ModdedLink<number> = {
        source: source ? data.result.nodes.indexOf(source) : 0,
        target: target ? data.result.nodes.indexOf(target) : 1,
        value: it.id,
        color: '#' + parseInt(it.id).toString(16)
      }
      return l

    })
    , groups: []
  }
  return output

}
export default class extends Component<Props> {

  render() {
    const { graph, icons, highlights, nodeRightClick, nodeDoubleClick, relationshipDoubleClick } = this.props
    return (
      <Graph graph={graph} icons={icons} highlights={highlights} nodeRightClick={nodeRightClick} nodeDoubleClick={nodeDoubleClick} relationshipDoubleClick={relationshipDoubleClick} />
    )
  }
}

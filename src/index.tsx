import { Component } from 'react'
import * as React from 'react'
import Graph, { GraphObject, Icons, ModdedNode, ModdedLink, } from './D3Component'
import { RawData2, Relationship, Node } from './raw-data-props2'
import * as _ from 'lodash'

export interface Props {
  graph: GraphObject
  icons: Icons
  highlights: string[]
  nodeRightClick?: (node: ModdedNode) => void
  nodeDoubleClick?: (node: ModdedNode) => void
  relationshipDoubleClick?: (link: ModdedLink<number>) => void
}
const getNodeIndexById = (nodes: Node[], relationships: Relationship[], mainGroup: string, subGroup: string | null) => {
  const nodesId = nodes.map(it => it.id)
  const nodesIndex = relationships.filter(it => (it.properties ? it.properties.catalyst_group : '') === mainGroup)
    .filter(it => (it.properties ? it.properties.catalyst_sub_group : 'skdljsldfk') === subGroup
      || (subGroup === null && it.properties && (typeof it.properties.catalyst_sub_group === 'undefined')))
    .map(it => it.source).map(it => nodesId.indexOf(it))
  return nodesIndex
}
const extractGroup = (data: RawData2) => {
  const result = data.result
  const relationships = result.relationships
  const nodes = result.nodes
  const allGroup = _.uniq(result.relationships.map(it => it.properties ? it.properties.catalyst_group : '')).filter(it => it)
  let mainGroup: {
    name: string;
    padding: number;
    leaves: number[];
    groups?: number[];
  }[] = []
  let counterIndex = 0
  allGroup.map(group => {
    counterIndex++
    const subGroups = _.uniq(relationships
      .filter(it2 => (it2.properties ? it2.properties.catalyst_group : '') === group)
      .map(it2 => it2.properties ? it2.properties.catalyst_sub_group + '' : '')
      .filter(it2 => it2 !== 'undefined')
    )

    const groups: number[] = []
    const subGroupMapped = subGroups.map(sg => {
      const leaves = getNodeIndexById(nodes, relationships, group, sg)
      groups.push(counterIndex++)
      return ({ name: sg, leaves, padding: 40 })
    })
    const leaves = getNodeIndexById(nodes, relationships, group, null)
    return [{ name: group, leaves, padding: 40, groups }, ...subGroupMapped]
  }).forEach(it => {
    mainGroup = [...mainGroup, ...it]
  })
  return mainGroup

}

export const convert = (data: RawData2, icons: Icons) => {
  //@ts-ignore
  const output: GraphObject = {
    nodes: data.result.nodes.map(it => {
      const d: ModdedNode = {
        id: it.id + '',
        icon: it.labels[0],
        name: it.properties.name,
        color: icons.labelColorMapping[it.labels[0].toLowerCase()],
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
        value: it.type,
        color: '#' + parseInt(it.id).toString(16)
      }
      return l

    })

    // @ts-ignore
    , groups: extractGroup(data)
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

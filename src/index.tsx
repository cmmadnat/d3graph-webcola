import { Component } from 'react'
import * as React from 'react'
import Graph, { GraphObject, Icons, ModdedNode, ModdedLink, } from './D3Component'
import { RawData2 } from './raw-data-props2'
import * as _ from 'lodash'
import { Group } from 'webcola'

export interface Props {
  graph: GraphObject
  icons: Icons
  highlights: string[]
  nodeRightClick?: (node: ModdedNode) => void
  nodeDoubleClick?: (node: ModdedNode) => void
  relationshipDoubleClick?: (link: ModdedLink<number>) => void
}
const extractGroup = (data: RawData2) => {
  const result = data.result
  const relationships = result.relationships
  const nodes = result.nodes
  const allGroup = _.uniq(result.relationships.map(it => it.properties ? it.properties.catalyst_group : '')).filter(it => it)
  const allSubGroup = _.uniqBy(result.relationships.map(it => ({ group: it.properties ? it.properties.catalyst_group : '', group_subgroup: it.properties ? it.properties.catalyst_sub_group : '' }))
    .filter(it => it.group_subgroup), 'group_subgroup')
  //@ts-ignore
  const mainGroup: Group[] = allGroup.flatMap(it => {
    return allSubGroup.filter(it2 => it2.group === it).map(it2 => {
      const leaves = relationships.filter(it3 => (it3.properties ? it3.properties.catalyst_group : '') == it2.group && (it3.properties ? it3.properties.catalyst_sub_group : '') == it2.group_subgroup)
        .map(it3 => nodes.findIndex(it4 => it4.id === it3.startNode))
      return ({ padding: 10, leaves: leaves })
    })

  })
  console.log(mainGroup)
  // return [{ padding: 10, leaves: [0, 1, 2] },
  // { padding: 10, leaves: [3, 4] },
  // ]
  return mainGroup
}

export const convert = (data: RawData2, icons: Icons) => {
  //@ts-ignore
  const output: GraphObject = {
    nodes: data.result.nodes.map(it => {
      const d: ModdedNode = {
        id: it.id + '',
        icon: it.labels[it.labels.length - 1],
        name: it.properties.name,
        color: icons.labelColorMapping[it.labels[it.labels.length - 1].toLowerCase()],
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

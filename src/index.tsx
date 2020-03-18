import { Component } from 'react'
import * as React from 'react'
import Graph, { GraphObject, Icons, ModdedNode, ModdedLink, } from './D3Component'
import { RawData2 } from './raw-data-props2'
import * as _ from 'lodash'

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
  let mainGroup = []
  const groupInMainGroupWithoutSubGroup = allGroup.map(it => {
    const leaves = relationships.filter(it2 => (it2.properties ? it2.properties.catalyst_group === it : false) &&
      (it2.properties ? it2.properties.catalyst_sub_group === '' : false)).map(it2 => it2.source)
      .map(it2 => nodes.filter(it3 => it3.id === it2)[0]).map(it2 => nodes.indexOf(it2))
    return {
      leaves,
      padding: 20,
      groups: [] as number[]
    }
  })
  const groupInMainGroupWithSubGroup = allSubGroup.map(subgroup => {
    const leaves = relationships.filter(it2 => (it2.properties ? it2.properties.catalyst_group === subgroup.group : false) &&
      (it2.properties ? it2.properties.catalyst_sub_group === subgroup.group_subgroup : false)).map(it2 => it2.source)
      .map(it2 => nodes.filter(it3 => it3.id === it2)[0]).map(it2 => nodes.indexOf(it2))
    return {
      leaves,
      padding: 20,
      groups: [] as number[]
    }
  })
  let oldGroup = ''
  let mainGroupCounter = 0
  let counterGroup: number[] = []
  allSubGroup.forEach((item, index) => {
    if (oldGroup === '') oldGroup = item.group
    if (oldGroup === item.group) counterGroup.push(index)
    else {
      groupInMainGroupWithoutSubGroup[mainGroupCounter++].groups = counterGroup
      counterGroup = []
    }
  })
  mainGroup = [...groupInMainGroupWithoutSubGroup, ...groupInMainGroupWithSubGroup].filter(it => it.leaves.length !== 0 && it.groups.length === 0)

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

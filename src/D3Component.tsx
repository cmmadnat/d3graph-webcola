import * as React from 'react'
import { useEffect } from 'react'
import * as d3 from "d3";
import * as webCola from 'webcola'
import { Node, Link, Group, } from 'webcola'

const OFFSET = 20
export interface Icons {
  labelColorMapping: any;
  icons: any;
  images: any;
}
interface GroupWithName extends Group {
  name: string
}
export interface GraphObject {
  nodes: ModdedNode[];
  links: ModdedLink<number>[];
  groups: GroupWithName[];
}

export interface ModdedNode extends Node {
  color?: string;
  id?: string;
  icon?: string;
  name?: string;
  svg?: string;
}
export interface ModdedLink<NodeRefType> extends Link<NodeRefType> {
  value: string;
  color: string;
  id: string;
  arrowHead?: boolean;
}

interface D3ComponentProps {
  icons: Icons
  graph: GraphObject
  highlights: string[]
  nodeRightClick?: (node: ModdedNode) => void
  nodeDoubleClick?: (node: ModdedNode) => void
  relationshipDoubleClick?: (link: Link<number>) => void

}
const getIcons = (icons: any, iconName: string) => {
  return icons[iconName]
}
const applyNodeInteraction = (target: any, dragFunction: any, rightClickFunction: any, doubleClickFunction: any) => {
  target.call(dragFunction)
    .on("contextmenu", function (node: Node) {
      d3.event.preventDefault();
      // react on right-clicking
      if (rightClickFunction) {
        rightClickFunction(node)
      }
    })
    .on('dblclick', (node: Node) => {
      d3.event.preventDefault();
      if (doubleClickFunction) {
        doubleClickFunction(node)
      }
    })
}


const D3Component = ({ graph, icons, highlights, nodeRightClick, nodeDoubleClick, relationshipDoubleClick }: D3ComponentProps) => {

  let nodeRef: HTMLDivElement | null = null
  useEffect(() => {
    var width = 960,
      height = 500;
    var cola = webCola.d3adaptor(d3)
      .size([width, height]);
    cola
      .nodes(graph.nodes)
      .links(graph.links)
      .groups(graph.groups)
      .jaccardLinkLengths(120, 0.7)
      .avoidOverlaps(true)
      .start(50, 0, 50);
    const redraw = () => {
      //@ts-ignore
      const transform = d3.event.transform
      svg.attr("transform", "translate(" + transform.x + "," + transform.y + ") scale(" + transform.k + ")");
    }

    var outer = d3.select(nodeRef).select("svg")
      .attr('class', 'cola-graph')
      .attr("pointer-events", "all")
      .call(d3.zoom().on("zoom", redraw))
      .on("dblclick.zoom", null)
    outer.select('rect')
      .attr('class', 'cola-graph-background')
      .attr('width', "100%")
      .attr('height', "100%")

    let svg = outer
      .select('g');

    const defs = svg.select('defs')
    defs.selectAll('marker').data(graph.links).enter().append('marker')
      .attr('id', (d) => {

        return 'arrowhead' + d.id;
      })
      .attr('viewBox', '-0 -5 10 10')
      .attr('refX', 22)
      .attr('refY', 0)
      .attr('orient', 'auto')
      .attr('markerWidth', 8)
      .attr('markerHeight', 8)
      .attr('xoverflow', 'visible')
      .append('svg:path')
      .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
      .style('stroke', 'none')
      .style('fill', d => d.color)


    let node = svg.selectAll(".node").data(graph.nodes)
    let label = svg.selectAll('.graph-cola-label').data(graph.nodes)
    let iconSvgLabel = svg.selectAll('.icon-svg-label').data(graph.nodes.filter(d => typeof d.svg !== 'undefined'))
    let iconLabel = svg.selectAll('.icon-label').data(graph.nodes.filter(d => typeof d.svg === 'undefined'))
    let link = svg.selectAll(".link").data(graph.links)
    let linkLabel = svg.selectAll(".link-label").data(graph.links)
    let group = svg.selectAll('.group').data(graph.groups)
    let groupLabel = svg.selectAll('.group-label').data(graph.groups)


    group
      .enter().append('rect')
      .classed('group', true)
      .attr('rx', 5)
      .attr('ry', 5)
      //@ts-ignor
      .style("fill", function (d, index) { return groupColor(index); })

    groupLabel
      .enter().append('text')
      .classed('group-label', true)
      .text(d => d.name)

    link
      .enter().append("line")
      .attr("class", "link")
      .style('stroke', d => d.color)
      .style("stroke-width", function () { return Math.sqrt(4); })
      .attr('marker-end', d => typeof d.arrowHead === 'undefined' || d.arrowHead ? 'url(#arrowhead' + d.id + ')' : '')
      .on('dblclick', (l) => {
        if (relationshipDoubleClick) {
          relationshipDoubleClick(l)
        }
      })

    var linkLabelG = linkLabel
      .enter()
      .append('g')
      .attr('class', 'link-label')
      .on('dblclick', (l: ModdedLink<number>) => {
        if (relationshipDoubleClick) {
          relationshipDoubleClick(l)
        }
      })
    linkLabelG
      .append('rect')
      .style('fill', 'white')
      .attr('x', (d: any, _index) => {
        return d.value.length * -5 / 2
      })
      .attr('y', -10)
      .attr('height', 20)
      .attr('width', (d: any) => {
        return 10 + d.value.length * 5
      })
    linkLabelG
      .append("text")
      .attr('x', 5)
      .attr("font-family", "Arial, Helvetica, sans-serif")
      .attr("fill", "Black")
      .style("font", "normal 12px Arial")
      .attr("dy", ".35em")
      .attr('text-anchor', 'middle')
      .text((d) => { return d.value; });

    var nodeG = node
      .enter().append("circle")
      .attr("class", d => d.id && highlights.indexOf(d.id) === -1 ? "node" : 'node-highlight')
      .attr("r", 20)
      // @ts-ignore
      .style("fill", function (d: ModdedNode) { return d.color })

    node.append("title")
      .text(function (d: any) { return d.name; })

    var iconLabelG = iconLabel
      .enter().append('text')
      .attr('class', 'icon icon-label')
      .html(d => {
        const icon = d.icon ? getIcons(icons.icons, d.icon) : ''
        return `&#x${icon};`;
      })
    var iconSvgLabelG = iconSvgLabel
      .enter().append('g')
      .attr('class', 'icon-svg-label')
      .html(d => {
        if (d.svg)
          return d.svg
        return ''
      })

    var labelG = label
      .enter()
      .append('g')
      .attr('class', 'graph-cola-label')
    labelG.append('rect')
      .attr('rx', 15)
      .attr('class', 'graph-cola-label-rect')
      .attr('height', 30)
      .attr('width', (d: ModdedNode) => {
        return d.name ? Math.min(23, d.name.length) * 8 : 8
      })
      .style('stroke', (d: ModdedNode) => {
        return d.icon ? icons.labelColorMapping[d.icon] : 'yellow'
      })
    labelG
      .append('text')
      .attr('x', (d: ModdedNode) => {
        const calcWidth = d.name ? Math.min(23, d.name.length) * 8 : 8
        return calcWidth / 2
      })
      .attr('text-anchor', 'middle')
      .attr('y', 20)
      .text((d: ModdedNode) => {
        return d.name ? d.name.length > 20 ? d.name.substr(0, 20) + '...' : d.name : ''
      })
      .attr('class', 'graph-cola-label-text')

    const dragFunction = cola.drag()
    //@ts-ignore
    dragFunction.on('start', (d: any) => {
      d.fixed = true
    })
    applyNodeInteraction(nodeG, dragFunction, nodeRightClick, nodeDoubleClick)
    applyNodeInteraction(labelG, dragFunction, nodeRightClick, nodeDoubleClick)
    applyNodeInteraction(iconLabelG, dragFunction, nodeRightClick, nodeDoubleClick)
    applyNodeInteraction(iconSvgLabelG, dragFunction, nodeRightClick, nodeDoubleClick)

    node.exit().remove()
    label.exit().remove()
    iconLabel.exit().remove()
    iconSvgLabel.exit().remove()
    group.exit().remove()
    groupLabel.exit().remove()
    link.exit().remove()
    linkLabel.exit().remove()
    cola.on('end', function () {
      node.call(cola.drag)
      label.call(cola.drag)
      iconLabel.call(cola.drag)
      iconSvgLabel.call(cola.drag)

    })

    cola.on('tick', function () {
      let node = svg.selectAll(".node")
      let label = svg.selectAll('.graph-cola-label')
      let iconSvgLabel = svg.selectAll('.icon-svg-label')
      let iconLabel = svg.selectAll('.icon-label')
      let link = svg.selectAll(".link")
      let linkLabel = svg.selectAll(".link-label")
      let group = svg.selectAll('.group')
      let groupLabel = svg.selectAll('.group-label')

      link.attr("x1", function (d: any) { return d.source.x; })
        .attr("y1", function (d: any) { return d.source.y; })
        .attr("x2", function (d: any) { return d.target.x; })
        .attr("y2", function (d: any) { return d.target.y; });

      linkLabel.attr('transform', (d: any) => {
        const x = d.target.x > d.source.x ? (d.source.x + (d.target.x - d.source.x) / 2) : (d.target.x + (d.source.x - d.target.x) / 2)
        const y = d.target.y > d.source.y ? (d.source.y + (d.target.y - d.source.y) / 2) : (d.target.y + (d.source.y - d.target.y) / 2)
        return `translate(${x},${y})`
      })

      node.attr("cx", function (d: any) { return d.x; })
        .attr("cy", function (d: any) { return d.y; });

      label
        .attr('transform', (d: any, index, selection) => {
          // @ts-ignore
          const w = selection[index].getBBox().width
          const x = d.x - w / 2
          const y = d.y + OFFSET
          return `translate(${x},${y})`
        })

      group
        .attr('x', function (d: Group) {
          // @ts-ignore
          return d.bounds.x
        })
        .attr('y', function (d: Group) {
          // @ts-ignore
          return d.bounds.y
        })
        .attr('width', function (d: Group) {
          // @ts-ignore
          return d.bounds.width()
        })
        .attr('height', function (d: Group) {
          // @ts-ignore
          return d.bounds.height()
        });

      groupLabel
        //@ts-ignore
        .attr('y', d => d.bounds.y)
        //@ts-ignore
        .attr('x', d => d.bounds.x + 10)

      iconLabel.attr('x', ((d: any) => d.x))
        .attr("y", function (d: any) {
          //@ts-ignore
          var h = this.getBBox().height;
          return d.y + h / 4;
        });


      iconSvgLabel.attr('transform', (d: any, index, selection) => {
        // @ts-ignore
        const w = selection[index].getBBox().width
        //@ts-ignore
        const h = selection[index].getBBox().height
        const x = d.x - w / 2 - 2
        const y = d.y - h / 2 - 2
        return `translate(${x},${y})`
      })
    });
    // end tick

  }, [graph])
  return (
    <div style={{ height: '100%' }} ref={ref => nodeRef = ref}>
      <svg>
        <rect />
        <g >
          <defs />
        </g>
      </svg>
    </div>
  )
}

const groupColor = (index: number) => {
  return ['#f6d186', '#fcf7bb', '#cbe2b0', '#f19292',
    '#f3d1f4', '#f5fcc1', '#bae5e5', '#98d6ea'][index % 8]
}
export default D3Component
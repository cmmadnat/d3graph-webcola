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
  const update = (svg: d3.Selection<SVGGElement, any, null, undefined>, cola: webCola.Layout & webCola.ID3StyleLayoutAdaptor
  ) => {
    const defs = svg.append('defs')
    defs.selectAll('marker').data(graph.links).enter().append('marker')
      .attr('id', (d) => {

        return 'arrowhead' + d.value;
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



    const dragFunction = cola.drag()
    //@ts-ignore
    dragFunction.on('start', (d: any) => {
      d.fixed = true
    })

    var group = svg.selectAll('.group')
      .data(graph.groups)
      .enter().append('rect')
      .classed('group', true)
      .attr('rx', 5)
      .attr('ry', 5)
      //@ts-ignore
      .style("fill", function (d, index) { return groupColor(index); })
      .call(dragFunction);

    var groupLabel = svg.selectAll('.groupLabel')
      .data(graph.groups)
      .enter().append('text')
      .classed('group-label', true)
      .text(d => d.name)

    var link = svg.selectAll(".link")
      .data(graph.links)
      .enter().append("line")
      .attr("class", "link")
      .style('stroke', d => d.color)
      .style("stroke-width", function (d) { return Math.sqrt(4); })
      .attr('marker-end', d => 'url(#arrowhead' + d.value + ')')
      .on('dblclick', (l) => {
        if (relationshipDoubleClick) {
          relationshipDoubleClick(l)
        }
      })


    var linkLabel = svg.selectAll(".link-label")
      .data(graph.links)
      .enter()
      .append('g')
      .on('dblclick', (l: ModdedLink<number>) => {
        if (relationshipDoubleClick) {
          relationshipDoubleClick(l)
        }
      })
    linkLabel
      .append('rect')
      .style('fill', 'white')
      .attr('x', (d: any, _index, group) => {
        return d.value.length * -5 / 2
      })
      .attr('y', -10)
      .attr('height', 20)
      .attr('width', (d: any) => {
        return 10 + d.value.length * 5
      })
    linkLabel
      .append("text")
      .attr('x', 5)
      .attr("font-family", "Arial, Helvetica, sans-serif")
      .attr("fill", "Black")
      .style("font", "normal 12px Arial")
      .attr("dy", ".35em")
      .attr('text-anchor', 'middle')
      .text(function (d) { return d.value; });

    var node = svg.selectAll(".node")
      .data(graph.nodes)
      .enter().append("circle")
      .attr("class", d => d.id && highlights.indexOf(d.id) === -1 ? "node" : 'node-highlight')
      .attr("r", 20)
      // @ts-ignore
      .style("fill", function (d: ModdedNode) { return d.color })
      .call(dragFunction)
    node.append("title")
      .text(function (d: any) { return d.name; })
    var iconLabel = svg.selectAll('.icon-label')
      .data(graph.nodes.filter(d => typeof d.svg === 'undefined'))
      .enter().append('text')
      .attr('class', 'icon icon-label')
      .html(d => {
        const icon = d.icon ? getIcons(icons.icons, d.icon) : ''
        return `&#x${icon};`;
      })
    var iconSvgLabel = svg.selectAll('.icon-svg-label')
      .data(graph.nodes.filter(d => typeof d.svg !== 'undefined'))
      .enter().append('g')
      .attr('class', 'icon-svg-label')
      .html(d => {
        if (d.svg)
          return d.svg
        return ''
      })


    var label = svg.selectAll('.graph-cola-label')
      .data(graph.nodes)
      .enter()
      .append('g')
    label.append('rect')
      .attr('rx', 15)
      .attr('class', 'graph-cola-label')
      .attr('height', 30)
      .attr('width', (d: ModdedNode) => {
        return d.name ? Math.min(23, d.name.length) * 8 : 8
      })
      .style('stroke', (d: ModdedNode) => {
        return d.icon ? icons.labelColorMapping[d.icon] : 'yellow'
      })
    label
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

    applyNodeInteraction(node, dragFunction, nodeRightClick, nodeDoubleClick)
    applyNodeInteraction(label, dragFunction, nodeRightClick, nodeDoubleClick)
    applyNodeInteraction(iconLabel, dragFunction, nodeRightClick, nodeDoubleClick)


    // remove
    link.exit().remove()
    linkLabel.exit().remove()
    node.exit().remove()
    label.exit().remove()
    group.exit().remove()
    groupLabel.exit().remove()
    iconLabel.exit().remove()

    cola.on('tick', function () {
      link.attr("x1", function (d: any) { return d.source.x; })
        .attr("y1", function (d: any) { return d.source.y; })
        .attr("x2", function (d: any) { return d.target.x; })
        .attr("y2", function (d: any) { return d.target.y; });

      linkLabel.attr('transform', (d: any, index, selections) => {
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
          var h = this.getBBox().height;
          return d.y + h / 4;
        });
      iconSvgLabel.attr('x', ((d: any) => d.x))
        .attr("y", function (d: any) {
          var h = this.getBBox().height;
          return d.y + h / 4;
        });

      iconSvgLabel.attr('transform', (d: any, index, selection) => {
        // @ts-ignore
        const h = selection[index].getBBox().height
        const x = d.x
        const y = d.y + h / 4
        return `translate(${x},${y})`
      })
    });
  }
  useEffect(() => {
    var width = 960,
      height = 500;

    var cola = webCola.d3adaptor(d3)
      .size([width, height]);
    var outer = d3.select(nodeRef).select("svg")
      .attr('class', 'cola-graph')
      .attr("pointer-events", "all")
      .call(d3.zoom().on("zoom", redraw))
      .on("dblclick.zoom", null)
    outer.append('rect')
      .attr('class', 'cola-graph-background')
      .attr('width', "100%")
      .attr('height', "100%")

    function redraw() {
      //@ts-ignore
      const transform = d3.event.transform
      svg.attr("transform", "translate(" + transform.x + "," + transform.y + ") scale(" + transform.k + ")");
    }

    var svg = outer
      .append('g');
    cola
      .nodes(graph.nodes)
      .links(graph.links)
      .groups(graph.groups)
      .jaccardLinkLengths(120, 0.7)
      .avoidOverlaps(true)
      .start(50, 0, 50);

    update(svg, cola)
  }, [graph])
  return (
    <div style={{ height: '100%' }} ref={ref => nodeRef = ref}>
      <svg />
    </div>
  )
}

const groupColor = (index: number) => {
  return ['#f6d186', '#fcf7bb', '#cbe2b0', '#f19292',
    '#f3d1f4', '#f5fcc1', '#bae5e5', '#98d6ea'][index % 8]
}
export default D3Component
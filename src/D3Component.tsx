import * as React from 'react'
import { useEffect } from 'react'
import * as d3 from "d3";
import * as webCola from 'webcola'
import { Group } from 'webcola'
import './style.css'
export interface Icons {
  labelColorMapping: any;
  icons: any;
  images: any;
}
export interface GraphObject {
  nodes: Node[];
  links: Link[];
}
export interface Link {
  source: number;
  target: number;
  value: number;
}
export interface Node {
  width?: number;
  height?: number;
  icon: string;
  name: string;
  group: number;
}

var colors = function (s: string) {
  // @ts-ignore
  return s.match(/.{6}/g).map(function (x: string) {
    return "#" + x;
  });

};
var category20 = colors("1f77b4aec7e8ff7f0effbb782ca02c98df8ad62728ff98969467bdc5b0d58c564bc49c94e377c2f7b6d27f7f7fc7c7c7bcbd22dbdb8d17becf9edae5");


interface D3ComponentProps {
  icons: Icons
  graph: GraphObject
}
const getIcons = (icons: any, iconName: string) => {
  return icons[iconName]
}

const D3Component = ({ graph, icons }: D3ComponentProps) => {
  let nodeRef: HTMLDivElement | null = null
  useEffect(() => {
    var width = 960,
      height = 500;

    const color = d3.scaleOrdinal(category20)
    var cola = webCola.d3adaptor(d3)
      .size([width, height]);

    var svg = d3.select(nodeRef).append("svg")
      .attr("width", width)
      .attr("height", height);

    var groupMap: any = {};
    graph.nodes.forEach(function (v, i) {
      var g = v.group;
      if (typeof groupMap[g] == 'undefined') {
        groupMap[g] = [];
      }
      groupMap[g].push(i);

      v.width = v.height = 10;
    });

    var groups: any[] = [];
    for (var g in groupMap) {
      groups.push({ id: g, leaves: groupMap[g] });
    }
    cola
      .nodes(graph.nodes)
      .links(graph.links)
      .groups(groups)
      .jaccardLinkLengths(40, 0.7)
      .avoidOverlaps(true)
      .start(50, 0, 50);

    var group = svg.selectAll('.group')
      .data(groups)
      .enter().append('rect')
      .classed('group', true)
      .attr('rx', 5)
      .attr('ry', 5)
      //@ts-ignore
      .style("fill", function (d) { return color(d.id); })
      .call(cola.drag);

    var link = svg.selectAll(".link")
      .data(graph.links)
      .enter().append("line")
      .attr("class", "link")
      .style("stroke-width", function (d) { return Math.sqrt(d.value); });

    var node = svg.selectAll(".node")
      .data(graph.nodes)
      .enter().append("circle")
      .attr("class", "node")
      .attr("r", 20)
      // @ts-ignore
      .style("fill", function (d: any) { return color(d.group); })
      .call(cola.drag)
    node.append("title")
      .text(function (d: any) { return d.name; })
      .call(cola.drag)

    var label = svg.selectAll('.icon-label')
      .data(graph.nodes)
      .enter().append('text')
      .attr('class', 'icon icon-label')
      .html(d => {
        const icon = getIcons(icons.icons, d.icon)
        return `&#x${icon};`;
      })
      .call(cola.drag)

    cola.on('tick', function () {
      link.attr("x1", function (d: any) { return d.source.x; })
        .attr("y1", function (d: any) { return d.source.y; })
        .attr("x2", function (d: any) { return d.target.x; })
        .attr("y2", function (d: any) { return d.target.y; });

      node.attr("cx", function (d: any) { return d.x; })
        .attr("cy", function (d: any) { return d.y; });

      group
        .attr('x', function (d: Group) { return d.bounds ? d.bounds.x : 10 })
        .attr('y', function (d: Group) { return d.bounds ? d.bounds.y : 10 })
        .attr('width', function (d: Group) { return d.bounds ? d.bounds.width() : 10 })
        .attr('height', function (d: Group) { return d.bounds ? d.bounds.height() : 10 });
      label.attr('x', ((d: any) => d.x))
        .attr("y", function (d: any) {
          var h = this.getBBox().height;
          return d.y + h / 4;
        });
    });
  });
  return (

    <div ref={ref => nodeRef = ref}>
    </div>
  )
}

export default D3Component
import Ember from 'ember';
import d3 from 'd3';

export default Ember.Component.extend({
  classNames: ['node-graph'],

  type: null, //passed from handlebars
  data: null, //passed from handlebars

  width: 900,
  height: 500,

  didInsertElement: function(){
    if(this.get('type') === "sorted" || this.get('type') === "unsorted"){
      this.send('showArray');
    }else if(this.get('type') === "bst" || this.get('type') === "heap"){
      this.send('showTree');
    }
  },

  actions: {
    showArray: function(){
      var nodeData = this.get('data');

      var labelW = 60;
      var labelH = 20;
      var spacingHorizontal = 20;
      var spacingVertical = 60;

      var svg = d3.select('.node-graph')
        .append('svg')
        .attr({width: this.get('width'), height: this.get('height')});
      var rootGroup = svg.append('g')
        .classed('root', true)
        .attr({transform: 'translate(0,0)'});

      // Marker
      ///////////////////////////////////
      var markerW = 6;
      var marker = svg.append('defs')
        .append('marker')
        .attr({
          id: 'Triangle',
          refX: markerW*2,
          refY: markerW,
          markerUnits: 'userSpaceOnUse',
          markerWidth: markerW + markerW,
          markerHeight: markerW * 2 + markerW,
          orient: '90deg'
        })
        .append('path')
        .attr({d: 'M 0 0 '+markerW*2+' '+markerW+' 0 '+markerW*2+' '+markerW/2+' '+markerW});

      // Edges
      ///////////////////////////////////
      var linkGenerator = d3.svg.line()
        .x(function(d, i){return d[0];})
        .y(function(d, i){return d[1];})
        .interpolate('linear');

      var flatDataset = d3.merge(nodeData);
      var linkPath = function(d, i, pI){
        var currentNode = flatDataset[pI];
        var childNode = flatDataset[d];
        var anchor1X = labelW / 2;//currentNode.levelIdx*(labelW+spacingHorizontal)+labelW/2;
        var anchor2X = labelW / 2;//childNode.levelIdx*(labelW+spacingHorizontal)+labelW/2;
        var anchor1Y = currentNode.level*(labelH+spacingVertical)+labelH;
        var anchor2Y = childNode.level*(labelH+spacingVertical);
        var path = linkGenerator([
          [anchor1X, anchor1Y],
          [anchor2X, anchor2Y]
        ]);
        return path;
      };

      var levels = rootGroup.selectAll('g.level')
        .data(nodeData)
        .enter().append('g')
        .classed('level', true);

      /*var arrowGroup = levels.selectAll('g.arrow-group')
        .data(function(d, i){return d;})
        .enter().append('g')
        .classed('arrow-group', true);

      arrowGroup.selectAll('path.arrow')
        .data(function(d, i){return d.children;})
        .enter().append('path')
        .classed('arrow', true)
        .attr({
          d: linkPath,
          'marker-end': 'url(#Triangle)'
        })
        .style({
          fill: 'none', 
          stroke: 'grey', 
          opacity: 1, 
          'stroke-width': 2
        });*/

      // Labels
      ///////////////////////////////////
      var labels = levels.selectAll('g.labels')
          .data(function(d, i){return d;})
          .enter().append('g')
          .classed('labels', true)
          .attr({transform: function(d, i, pI){
            return 'translate('+(i*(labelW+spacingHorizontal))+','+pI*(labelH+spacingVertical)+')';
          }});
      labels.append('rect')
          .classed('label-frame', true)
          .attr({
            x: 0,
            y: 0,
            width: labelW,
            height: labelH
          })
          .style({fill: function(d, i){return (d.children.length == 0)? 'yellowgreen' : '#336699';}, stroke: 'grey'});
      labels.append('text')
          .classed('label-text', true)
          .attr({
            x: 4,
            y: 0,
            dy: '1em'
          })
          .style({fill: 'white', 'font-family': 'Arial, sans-serif', 'font-size': '14px'})
          .text(function(d, i){
            return d.name + ":" + d.value;
          });
    },

    showTree: function(){

    }
  }
});

/*
  graph component created using biovisualize's Simple Binary Tree
  http://bl.ocks.org/biovisualize/5369188

  {{inventory/node-graph
    type=<graphType>
    data=<graphData>
    update=<updateToggle>
  }}

  <graphType>: string with the following available values: "sorted", "unsorted",
  "bst", "heap". It tells the component to use respective rendering function

  <graphData>: array consisting of the node data, structured in the way that 
  biovisualize's rendering function works

  <updateToggle>: boolean value toggled whenever user clicks on a different
  graph type or adds a new node.
*/

import Ember from 'ember';
import d3 from 'd3';

export default Ember.Component.extend({
  classNames: ['node-graph'],

  width: 900,
  height: 500,

  didInsertElement: function(){
    if(this.get('type') === "sorted" || this.get('type') === "unsorted"){
      this.send('showArray');
    }else if(this.get('type') === "bst" || this.get('type') === "heap"){
      this.send('showTree');
    }
  },

  updateGraph: Ember.observer('update', function(){
    if(this.get('type') === "sorted" || this.get('type') === "unsorted"){
      this.send('showArray');
    }else if(this.get('type') === "bst" || this.get('type') === "heap"){
      this.send('showTree');
    }
  }),

  actions: {
    showArray: function(){
      Ember.$('.node-graph svg').remove(); //clear old graph

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

      // Levels
      ///////////////////////////////////
      var levels = rootGroup.selectAll('g.level')
        .data(this.get('data'))
        .enter().append('g')
        .classed('level', true);

      // Labels
      ///////////////////////////////////
      var labels = levels.selectAll('g.labels')
          .data(function(d){return d;})
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
          .style({fill: '#336699', stroke: 'grey'});
      labels.append('text')
          .classed('label-text', true)
          .attr({
            x: 4,
            y: 0,
            dy: '1em'
          })
          .style({fill: 'white', 'font-family': 'Arial, sans-serif', 'font-size': '14px'})
          .text(function(d){
            return d.name + ":" + d.value;
          });
    },

    showTree: function(){
      Ember.$('.node-graph svg').remove(); //clear old graph

      var labelW = 60;
      var labelH = 20;
      var spacingVertical = 60;

      var svg = d3.select('.node-graph')
        .append('svg')
        .attr({
          width: this.get('width'), 
          height: this.get('height')
        });
      var rootGroup = svg.append('g')
        .classed('root', true)
        .attr({transform: 'translate(0,0)'});

      // Levels
      ///////////////////////////////////
      var levels = rootGroup.selectAll('g.level')
        .data(this.get('data'))
        .enter().append('g')
        .classed('level', true);

      // Edges
      ///////////////////////////////////
      var linkGenerator = d3.svg.line()
        .x(function(d){return d[0];})
        .y(function(d){return d[1];})
        .interpolate('linear');

      var linkPath = function(d, i, j){
        //root node has no parent
        if(i === 0 && j === 0){
          return;
        }
        //node is undefined
        if(d === undefined){
          return;
        }

        let anchor1X = i * (900/Math.pow(2, j)) + 900/Math.pow(2, j + 1) + labelW / 2;
        let anchor1Y = j * (labelH+spacingVertical);
        let anchor2X = (i >> 1) * (900/Math.pow(2, j - 1)) + 900/Math.pow(2, j) + labelW/ 2;
        let anchor2Y = (j - 1) * (labelH+spacingVertical) + labelH;
        
        return linkGenerator([
          [anchor1X, anchor1Y],
          [anchor2X, anchor2Y]
        ]);
      };

      levels.selectAll('path.arrow')
        .data(function(d){return d;})
        .enter().append('path')
        .classed('arrow', true)
        .attr({d: linkPath})
        .style({
          fill: 'none',
          stroke: 'grey',
          opacity: 1,
          'stroke-width': 2
        });

      // Labels
      ///////////////////////////////////
      var labels = levels.selectAll('g.labels')
          .data(function(d){ return d; })
          .enter().append('g')
          .classed('labels', true)
          .attr({transform: function(d, i, j){
            return 'translate('+(i*(900/Math.pow(2, j))+ 900/Math.pow(2, j+1)) + ','+ j*(labelH+spacingVertical)+')';
          }});
      labels.append('rect')
          .classed('label-frame', true)
          .attr({
            x: 0,
            y: 0,
            width: labelW,
            height: labelH
          })
          .style('fill', function(d){ return d ? "#336699" : "#ffffff"; })
          .style('stroke', function(d){ return d ? "grey" : "#ffffff"; });
      labels.append('text')
          .classed('label-text', true)
          .attr({
            x: 4,
            y: 0,
            dy: '1em'
          })
          .style({fill: 'white', 'font-family': 'Arial, sans-serif', 'font-size': '14px'})
          .text(function(d){
            return d? d.name + ":" + d.value : null;
          });
    }
  }
});

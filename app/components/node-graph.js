import Ember from 'ember';
import d3 from 'd3';

export default Ember.Component.extend({
  classNames: ['node-graph'],

  type: null, //passed from handlebars
  data: null, //passed from handlebars

  width: 900,
  height: 500,

  didInsertElement: function(){
    console.log('running svg function');
    var svg = d3.select('.node-graph')
      .append('svg')
      .attr({width: this.get('width'), height: this.get('height')});
    var rootGroup = svg.append('g')
      .classed('root', true)
      .attr({transform: 'translate(0,0)'});
  },
});

import Ember from 'ember';
import d3 from 'd3';

export default Ember.Controller.extend({
  data: Ember.computed('model', function(){
    return JSON.parse(JSON.stringify(this.get('model').toArray()));
  }),

  width: 900,
  height: 500,

  init: function(){
    console.log('running svg function');
    var svg = d3.select('.svg-graph')
      .append('svg')
      .attr({width: this.get('width'), height: this.get('height')});
    var rootGroup = svg.append('g')
      .classed('root', true)
      .attr({transform: 'translate(0,0)'});
  }
});

import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  value: DS.attr('number')
});

/*model.reopenClass({
  FIXTURES: [
    {id: 1, name: 'Bob', value: 5},
    {id: 2, name: 'Joe', value: 10}
  ]
});

export default model;*/

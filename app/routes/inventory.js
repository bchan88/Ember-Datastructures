import Ember from 'ember';

export default Ember.Route.extend({
  model: function(){
    return this.store.findAll('node');
  },

  actions: {
    delete: function(model){
      model.destroyRecord();
      return false;
    },

    edit: function(model){
      this.transitionTo('inventory.edit', model);
      return false;
    }
  }
});

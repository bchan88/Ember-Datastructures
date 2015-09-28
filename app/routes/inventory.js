import Ember from 'ember';

export default Ember.Route.extend({
  model: function(){
    return this.store.findAll('node');
  },

  actions: {
    delete: function(model){
      var _this = this;

      model.destroyRecord().then(function(){
        _this.controllerFor('graphs').send('resetBstData');
        _this.controllerFor('graphs').send('resetHeapData');
      });
      
      return false;
    },

    edit: function(model){
      this.transitionTo('inventory.edit', model);
      return false;
    }
  }
});

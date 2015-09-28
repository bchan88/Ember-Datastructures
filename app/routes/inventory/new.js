import Ember from 'ember';

export default Ember.Route.extend({
  model: function(){
    return this.store.createRecord('node');
  },

  actions: {
    save: function(){
      var _this = this;
      var model = this.modelFor('inventory.new');

      model.save().then(function(){
        _this.controllerFor('graphs').send('resetBstData');
        _this.controllerFor('graphs').send('resetHeapData');
        _this.transitionTo('inventory');
      });

      return false;
    },

    cancel: function(){
      var _this = this;
      var model = this.modelFor('inventory.new');

      model.destroyRecord().then(function(){
        _this.transitionTo('inventory');
      });

      return false;
    }
  }
});

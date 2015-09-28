import Ember from 'ember';

export default Ember.Route.extend({
  actions: {
    save: function(){
      var _this = this;
      var model = this.modelFor('inventory.edit');

      model.save().then(function(){
        _this.controllerFor('graphs').send('resetBstData');
        _this.controllerFor('graphs').send('resetHeapData');
        _this.transitionTo('inventory');
      });

      return false;
    },

    cancel: function(){
      var _this = this;
      var model = this.modelFor('inventory.edit');

      model.rollback();
      _this.transitionTo('inventory');

      return false;
    }
  }
});

import Ember from 'ember';

export default Ember.Route.extend({
  model: function(){
    return this.store.createRecord('node');
  },

  actions: {
    save: function(){
      var _this = this;
      var model = this.modelFor('graphs.new');

      model.save().then(function(){
        _this.modelFor('graphs').update();
        _this.controllerFor('graphs').send('updateBstData', model);
        _this.controllerFor('graphs').send('updateHeapData', model);
        _this.controllerFor('graphs').toggleProperty('updateToggle');
        _this.transitionTo('graphs');
      });

      return false;
    },

    cancel: function(){
      var _this = this;
      var model = this.modelFor('graphs.new');

      model.destroyRecord().then(function(){
        _this.transitionTo('graphs');
      });

      return false;
    }
  }
});

import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['node-form'],

  //model is passed as a handlebar parameter
  model: null,

  didInsertElement: function(){
    this.$('.modal').modal('show');
  },

  click: function(event){
    //if the user clicks outside of the modal
    if (this.$('.modal.fade')[0] === this.$(event.target)[0]) {
      this.sendAction('cancel');
    }
  },

  actions: {
    modalSave: function(){
      this.sendAction('save');
    },

    modalCancel: function(){
      this.sendAction('cancel');
    }
  }
});

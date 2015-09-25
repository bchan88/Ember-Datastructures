import Ember from 'ember';


export default Ember.Controller.extend({
  data: Ember.computed('model', function(){
    return JSON.parse(JSON.stringify(this.get('model').toArray()));
  }),

  type: "unsorted",

  unsortedClass: Ember.computed('type', function(){
    if(this.get('type') === "unsorted"){
      return "btn btn-primary active";
    }else{
      return "btn btn-primary";
    }
  }),

  sortedClass: Ember.computed('type', function(){
    if(this.get('type') === "sorted"){
      return "btn btn-primary active";
    }else{
      return "btn btn-primary";
    }
  }),

  bstClass: Ember.computed('type', function(){
    if(this.get('type') === "bst"){
      return "btn btn-primary active";
    }else{
      return "btn btn-primary";
    }
  }),

  heapClass: Ember.computed('type', function(){
    if(this.get('type') === "heap"){
      return "btn btn-primary active";
    }else{
      return "btn btn-primary";
    }
  }),

  actions: {
    setGraph: function(type){
      this.set('type', type);
    }
  }
});

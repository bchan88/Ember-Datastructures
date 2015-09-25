import Ember from 'ember';

export default Ember.Controller.extend({
  indexClass: Ember.computed('target.url', function(){
    if(this.get('target.url') === "/graphs"){
      return "btn btn-primary active";
    }else{
      return "btn btn-primary";
    }
  }),

  sortedClass: Ember.computed('target.url', function(){
    if(this.get('target.url') === "/graphs/sorted"){
      return "btn btn-primary active";
    }else{
      return "btn btn-primary";
    }
  }),

  bstClass: Ember.computed('target.url', function(){
    if(this.get('target.url') === "/graphs/bst"){
      return "btn btn-primary active";
    }else{
      return "btn btn-primary";
    }
  }),

  heapClass: Ember.computed('target.url', function(){
    if(this.get('target.url') === "/graphs/heap"){
      return "btn btn-primary active";
    }else{
      return "btn btn-primary";
    }
  })
});

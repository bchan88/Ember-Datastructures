import Ember from 'ember';


export default Ember.Controller.extend({
  data: Ember.computed('model.@each', 'model.@each.value', 'model.@each.name', function(){
    var model = JSON.parse(JSON.stringify(this.get('model').toArray()));

    var arr = [];

    for(var i = 0; i < model.length; i++){
      arr.push({
        children: [i + 1],
        level: 0,
        levelIdx: i,
        name: model[i].name,
        value: model[i].value
      });
    }

    return [arr];
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

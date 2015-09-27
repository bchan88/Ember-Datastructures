import Ember from 'ember';


export default Ember.Controller.extend({
  unsortedData: Ember.computed('model.@each', 'model.@each.value', 'model.@each.name', function(){
    let arr = [];
    let model = this.get('model').toArray();

    for(let i = 0; i < model.length; i++){
      arr.push({
        children: [i + 1],
        name: model[i].get('name'),
        value: model[i].get('value')
      });
    }
    
    return arr = [arr];
  }),

  sortedData: Ember.computed('model.@each', 'model.@each.value', 'model.@each.name', function(){
    let arr = [];
    let model = this.get('model').sortBy('value');

    for(let i = 0; i < model.length; i++){
      arr.push({
        children: [i + 1],
        name: model[i].get('name'),
        value: model[i].get('value')
      });
    }

    return [arr];
  }),

  data: Ember.computed('model.@each', 'model.@each.value', 'model.@each.name', 'type', function(){
    let arr = [];
    let model;

    switch (this.get('type')){
      case "unsorted":
        model = this.get('model').toArray();

        for(let i = 0; i < model.length; i++){
          arr.push({
            name: model[i].get('name'),
            value: model[i].get('value')
          });
        }
        arr = [arr];
        break;

      case "sorted":
        model = this.get('model').sortBy('value');

        for(let i = 0; i < model.length; i++){
          arr.push({
            name: model[i].get('name'),
            value: model[i].get('value')
          });
        }
        arr = [arr];
        break;

      case "bst":
        model = this.get('model').sortBy('value');
        let tree = [];
        while(tree.push([]) < parseInt(Math.log2(model.length) + 1)){}

        let buildLevel = function(min, max, levelIndex, level){
          let mid = parseInt((min + max) / 2);
          tree[level][levelIndex] = {name: model[mid].get('name'), value: model[mid].get('value')};

          if(mid > min){
            buildLevel(min, mid - 1, levelIndex << 1, level + 1);
          }

          if(mid < max){
            buildLevel(mid + 1, max, (levelIndex << 1) + 1, level + 1);
          }
        };

        buildLevel(0, model.length - 1, 0, 0);
        arr = tree;
        break;

      case "heap":
        model = this.get('model').sortBy('value');
        let modelIndex = 0;
        let height = parseInt(Math.log2(model.length ) + 1);

        for(let i = 0; i < height; i++){
          let levelArr = [];
          for(let j = 0; j < Math.pow(2, i); j++){
            if(modelIndex >= model.length){
              break;
            }

            levelArr.push({
              name: model[modelIndex].get('name'),
              value: model[modelIndex].get('value')
            });

            modelIndex++;
          }
          arr.push(levelArr);
        }

        break;
    }

    return arr;
  }),

  type: "unsorted", //unsorted array is the default
  updateToggle: false, //toggled every time a user clicks to a different graph or adds node

  //Following computed values are used to determine the button classes
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
    //action set off by the group button click
    //sets the graph type and fires off updateToggle to update the graph
    setGraph: function(type){
      this.set('type', type);
      this.toggleProperty('updateToggle');
    }
  }
});

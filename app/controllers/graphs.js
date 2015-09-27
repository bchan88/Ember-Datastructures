import Ember from 'ember';


export default Ember.Controller.extend({
  type: "unsorted", //unsorted array is the default
  updateToggle: false, //toggled every time a user clicks to a different graph or adds node

  heapLevel: 0,
  heapLevelIndex: 0,

  data: Ember.computed('updateToggle', function(){
    switch(this.get('type')){
      case "unsorted":
        return this.get('unsortedData');
      case "sorted":
        return this.get('sortedData');
      case "bst":
        return this.get('bstData');
      case "heap":
        return this.get('heapData');
    }
  }),

  unsortedData: Ember.computed('updateToggle', function(){
    let model = this.get('model').toArray();
    
    return [JSON.parse(JSON.stringify(model))];
  }),

  sortedData: Ember.computed('updateToggle', function(){
    let model = this.get('model').sortBy('value');

    return [JSON.parse(JSON.stringify(model))];
  }),

  bstData: Ember.computed(function(){
    let model = this.get('model').sortBy('value');
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
    return tree;
  }),

  heapData: Ember.computed(function(){
    let model = this.get('model').sortBy('value');
    let modelIndex = 0;
    let height = parseInt(Math.log2(model.length) + 1);
    let heap = [];

    for(var i = 0; i < height; i++){
      let levelHeap = [];
      for(var j = 0; j < Math.pow(2, i); j++){
        if(modelIndex >= model.length){
          break;
        }

        levelHeap.push({
          name: model[modelIndex].get('name'),
          value: model[modelIndex].get('value')
        });

        modelIndex++;
      }
      heap.push(levelHeap);
    }

    this.set('heapLevel', i - 1);
    this.set('heapLevelIndex', j - 1);

    return heap;
  }),

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

      /*switch(this.get('type')){
        case "unsorted":
          this.set('data', this.get('unsortedData'));
          break;
        case "sorted":
          this.set('data', this.get('sortedData'));
          break;
        case "bst":
          this.set('data', this.get('bstData'));
          break;
        case "heap":
          this.set('data', this.get('heapData'));
          break;
      }*/
    },

    updateBstData: function(){
      let newNode = JSON.parse(JSON.stringify(this.get('model').get('lastObject')));
      let tree = this.get('bstData');
      let level = 0;
      let levelIndex = 0;

      var findSpot = function(){
        if(newNode.value < tree[level][levelIndex].value){
          //traverse to left child
          level++;
          levelIndex <<= 1;
        }else{
          //traverse to right child
          level++;
          levelIndex = (levelIndex << 1) + 1;
        }

        //add a level if the tree needs to grow
        if(!tree[level]){
          tree.push([]);
        }

        if(tree[level][levelIndex] !== undefined){
          //if child exists, recurse
          findSpot();
        }else{
          //insert new node here
          tree[level][levelIndex] = newNode;
        }
      };

      findSpot();
      this.set('bstData', Ember.A(tree));
      this.toggleProperty('updateToggle');
    },

    resetBstData: function(){
      let model = this.get('model').sortBy('value');
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
      this.set('bstData', tree);
    },

    updateHeapData: function(){
      let heap = this.get('heapData');
      let level = this.get('heapLevel');
      let levelIndex = this.get('heapLevelIndex');

      if(levelIndex + 1 < Math.pow(2, level)){
        //there is still room on this row
        this.set('heapLevelIndex', ++levelIndex);
      }else{
        //create a new row
        this.set('heapLevel', ++level);
        this.set('heapLevelIndex', 0);
        levelIndex = 0;
        heap.push([]);
      }

      //insert newest node at the end of the tree
      heap[level][levelIndex] = JSON.parse(JSON.stringify(this.get('model').get('lastObject')));

      //bubble up
      while(level !== 0 && levelIndex !== 0){
        if(heap[level][levelIndex].value < heap[level - 1][levelIndex >> 1].value){
          //if child node is less than parent node, swap
          console.log('swap');
          var temp = heap[level][levelIndex];
          heap[level][levelIndex] = heap[level - 1][levelIndex >> 1];
          heap[level - 1][levelIndex >> 1] = temp;
        }else{
          console.log('break');
          break;
        }

        level--;
        levelIndex >>= 1;
      }

      this.set('heapData', heap);
    }
  }
});

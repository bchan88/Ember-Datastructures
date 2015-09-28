import Ember from 'ember';

export default Ember.Controller.extend({
  updateToggle: false, //toggled every time a user clicks to a different graph or adds node

  heapLevel: 0, //keeps track of the last variable added to the heap
  heapLevelIndex: 0,

  /*
    Unsorted and sorted data are one dimensional arrays of all the nodes.
    Computed property means they will updated whenever updateToggle is fired.
  */
  unsortedData: Ember.computed('updateToggle', function(){
    let model = this.get('model').toArray();
    
    return [JSON.parse(JSON.stringify(model))];
  }),

  sortedData: Ember.computed('updateToggle', function(){
    let model = this.get('model').sortBy('value');

    return [JSON.parse(JSON.stringify(model))];
  }),

  //bstData is setup in the route using setupController
  //heapData is setup in the route using setupController

  /*
    Following computed values are used to determine the active button classes
  */
  unsortedClass: Ember.computed('type', function(){
    if(this.get('type') === "unsorted"){
      this.set('unsorted', true);
      return "btn btn-primary active";
    }else{
      this.set('unsorted', false);
      return "btn btn-primary";
    }
  }),

  sortedClass: Ember.computed('type', function(){
    if(this.get('type') === "sorted"){
      this.set('sorted', true);
      return "btn btn-primary active";
    }else{
      this.set('sorted', false);
      return "btn btn-primary";
    }
  }),

  bstClass: Ember.computed('type', function(){
    if(this.get('type') === "bst"){
      this.set('bst', true);
      return "btn btn-primary active";
    }else{
      this.set('bst', false);
      return "btn btn-primary";
    }
  }),

  heapClass: Ember.computed('type', function(){
    if(this.get('type') === "heap"){
      this.set('heap', true);
      return "btn btn-primary active";
    }else{
      this.set('heap', false);
      return "btn btn-primary";
    }
  }),

  /*
    Observer to check data is updated, then update graphs
  */
  observeData: Ember.observer('bstData','heapData', function(){
    this.toggleProperty('updateToggle');
  }),

  actions: {
    /*
      action set off by the group button click.
      takes a string parameter designating type.
      the template will then display the selected graph
      and fires off updateToggle to update the graph
    */
    setGraph: function(type){
      this.set('type', type);
      this.toggleProperty('updateToggle');
    },

    /*
      action fired when a user adds a new node from the graphs
      page. the new node is passed in as the <model> parameter
      and inserted in to the sorted binary tree.
    */
    updateBstData: function(model){
      let newNode = JSON.parse(JSON.stringify(model));
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
      this.set('bstData', tree);
    },

    /*
      reset function called from the inventory page. When a user makes
      changes from the inventory, the BST is reset and rebalanced.
    */
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

    /*
      action called from when user inserts new node from graphs page.
      The new node is passed as the <model> parameter and inserted at
      the bottom of the heap, then it bubbles up to make sure the min
      heap remains true.
    */
    updateHeapData: function(model){
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
      heap[level][levelIndex] = JSON.parse(JSON.stringify(model));

      //bubble up
      while(level !== 0){
        if(heap[level][levelIndex].value < heap[level - 1][levelIndex >> 1].value){
          //if child node is less than parent node, swap
          var temp = heap[level][levelIndex];
          heap[level][levelIndex] = heap[level - 1][levelIndex >> 1];
          heap[level - 1][levelIndex >> 1] = temp;
        }else{
          break;
        }

        level--;
        levelIndex >>= 1;
      }

      this.set('heapData', heap);
    },

    /*
      reset function called from the inventory page. When a user makes
      changes from the inventory, the heap is reset and rebalanced.
    */
    resetHeapData: function(){
      let model = this.get('model').sortBy('value');
      let modelIndex = 0;
      let height = parseInt(Math.log2(model.length) + 1);
      let heap = [];
      let i, j;

      for(i = 0; i < height; i++){
        let levelHeap = [];
        for(j = 0; j < Math.pow(2, i); j++){
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

      this.set('heapData', heap);
    }
  }
});

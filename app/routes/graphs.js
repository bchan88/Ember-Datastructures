import Ember from 'ember';

export default Ember.Route.extend({
  model: function(){
    return this.store.findAll('node');
  },

  setupController: function(controller, model){
    controller.set('model', model);
    controller.set('type', 'unsorted'); //default to unsorted
    let data = model.sortBy('value');

    /*
      Set up the BST data for the controller. Parses all the sorted
      nodes into a two dimensional array with the middle element as the
      root node.
    */
    let tree = [];
    while(tree.push([]) < parseInt(Math.log2(data.length) + 1)){}

    let buildLevel = function(min, max, levelIndex, level){
      let mid = parseInt((min + max) / 2);
      tree[level][levelIndex] = {name: data[mid].get('name'), value: data[mid].get('value')};

      if(mid > min){
        buildLevel(min, mid - 1, levelIndex << 1, level + 1);
      }

      if(mid < max){
        buildLevel(mid + 1, max, (levelIndex << 1) + 1, level + 1);
      }
    };

    buildLevel(0, data.length - 1, 0, 0);
    controller.set('bstData', tree);

    /*
      Set up the heap data for the controller. Parses the sorted nodeds
      into a two dimensional array. The one dimensional array is parsed in
      order and inserted into the heap in level order fashion.
    */
    let dataIndex = 0;
    let height = parseInt(Math.log2(data.length) + 1);
    let heap = [];
    let i, j;

    for(i = 0; i < height; i++){
      let levelHeap = [];
      for(j = 0; j < Math.pow(2, i); j++){
        if(dataIndex >= data.length){
          break;
        }

        levelHeap.push({
          name: data[dataIndex].get('name'),
          value: data[dataIndex].get('value')
        });

        dataIndex++;
      }
      heap.push(levelHeap);
    }

    controller.set('heapLevel', i - 1);
    controller.set('heapLevelIndex', j - 1);

    controller.set('heapData', heap);
  }
});

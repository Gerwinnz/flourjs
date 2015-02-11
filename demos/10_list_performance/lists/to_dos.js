
flour.addList('to_dos', function(){

  var list = this;

  list.template = 'to_do';
  list.key = 'id';

  // events
  list.events = {
    'change .complete-to-do': 'completeTask',
    'click .delete-to-do': 'deleteTask',
    'click .reset-to-do': 'resetTask'
  };

  // init
  list.init = function(params){
    list.add(params.items);
  };

  // mark a task as complete
  list.completeTask = function(event, el){
    var value = el.prop('checked');
    var id = el.data('id');
    list.update(id, 'complete', value);
  };


  // delete item
  list.deleteTask = function(event, el){
    var id = el.data('id');
    list.remove(id);
  };


  // reset item
  list.resetTask = function(event, el){
    var id = el.data('id');
    list.update(id, 'task', 'Empty item.');
  };

});
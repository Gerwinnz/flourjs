
flour.addView('main', function(){

  var view = this;
  var myApp = null;

  view.template = 'main';

  // events
  view.events = {
    'submit form': 'addTask',
    'change .complete-to-do': 'completeTask',
    'click .delete-to-do': 'deleteTask',
    'click .reset-to-do': 'resetTask'
  };


  // privates
  var toDosList = null;


  // init
  view.init = function(params){
    
    var toDos = [];

    view.set('task', '', false);
    view.set('view', view, false);

    for(var i = 0; i < 1000; i ++){
      toDos.push({
        id: i,
        task: 'My task is number: ' + i
      });
    }

    toDosList = new flour.list(toDos, {
      template: 'to_do',
      itemClass: 'to-do-item',
      lookupKey: 'id',

      onChange: function(data)
      {
        // localStorage.setItem('to_dos', JSON.stringify(data));
      }
    });

    view.render();
  };


  // post render
  view.postRender = function(){
    view.find('.to-dos-list').append(toDosList.el);
  };


  // add item
  view.addTask = function(event, el){
    event.preventDefault();
    var task = view.get('task');

    if(task === ''){
      view.find('.new-input').focus();
      return;
    }

    var toDo = {
      'task': task
    };

    view.set('task', '', false);
    
    toDosList.add(toDo);
  };


  // mark a task as complete
  view.completeTask = function(event, el){
    var value = el.prop('checked');
    var id = el.data('id');
    toDosList.update(id, 'complete', value);
  }


  // delete item
  view.deleteTask = function(event, el){
    var id = el.data('id');
    toDosList.remove(id);
  };


  // reset item
  view.resetTask = function(event, el){
    var id = el.data('id');
    toDosList.update(id, 'task', 'Empty item.');
  }

});
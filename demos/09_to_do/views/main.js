
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
    var toDos = localStorage.getItem('to_dos');
    view.set('task', '', false);
    view.set('view', view, false);

    if(toDos === null){
      toDos = [];
    }else{
      toDos = JSON.parse(toDos);
    }

    toDosList = new flour.list(toDos, {
      template: 'to_do',
      itemClass: 'to-do-item',

      onChange: function(data)
      {
        localStorage.setItem('to_dos', JSON.stringify(data));
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
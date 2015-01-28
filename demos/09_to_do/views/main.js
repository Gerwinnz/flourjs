
flour.addView('main', function(){

  var view = this;
  var myApp = null;

  view.template = 'main';


  // events
  view.events = {
    'submit form': 'addTask',
    'click .delete-to-do': 'deleteTask'
  };

  view.helpers = ['bind'];

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
      template: 'to_do'
    });

    view.on('model.to_dos:change', function(toDos){
      localStorage.setItem('to_dos', JSON.stringify(toDos));
    });

    view.render();

    console.log(toDosList);
  };

  // post render
  view.postRender = function(){
    view.find('.to-dos-list').append(toDosList.el);
  };

  // define class
  view.listClass = function(checked){
    return checked ? 'is-done' : '';
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


  // delete item
  view.deleteTask = function(event, el){
    var toDos = view.get('to_dos');
    var index = el.data('index');
    var item = toDos[index];

    toDos.splice(index, 1);
    view.set('to_dos', toDos);
  };

});
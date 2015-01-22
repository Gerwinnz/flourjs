
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


  // init
  view.init = function(params){
    var toDos = localStorage.getItem('to_dos');
    view.set('task', '', false);

    if(toDos === null){
      view.set('to_dos', []);
    }else{
      toDos = JSON.parse(toDos);
      view.set('to_dos', toDos);
    }

    view.on('model.to_dos:change', function(toDos){
      localStorage.setItem('to_dos', JSON.stringify(toDos));
    });
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

    var toDos = view.get('to_dos');
    toDos.push(toDo);

    view.set('task', '', false);
    view.set('to_dos', toDos);
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
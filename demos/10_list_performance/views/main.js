
flour.addView('main', function(){

  var view = this;
  var myApp = null;

  view.template = 'main';

  // events
  view.events = {
    'submit form': 'addTask'
  };


  // privates
  totalItems = 2000;
  var toDosList = null;


  // init
  view.init = function(params){
    
    var toDos = [];

    view.set('task', '', false);

    for(var i = 0; i < totalItems; i ++){
      toDos.push({
        id: i,
        task: 'My task is number: ' + i
      });
    }

    toDosList = flour.getList('to_dos', {
      items: toDos
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

    // create our task object
    var toDo = {
      'id': totalItems,
      'task': task
    };

    // keep incrementing out id
    totalItems ++;

    // reset input
    view.set('task', '', false);
    view.find('.new-input').focus();
    toDosList.add(toDo);
  };


});
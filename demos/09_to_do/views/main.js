
flour.addView('main', function(){

  var view = this;

  view.template = 'main';

  // events
  view.events = {
    'submit form': 'addTask'
  };


  // privates
  var id = 0;
  var toDosList = null;
  


  // init
  view.init = function(params){
    
    id = localStorage.getItem('id') === null ? 0 : localStorage.getItem('id');
    var toDos = localStorage.getItem('to_dos') === null ? [] : JSON.parse(localStorage.getItem('to_dos'));

    toDosList = flour.getList('to_dos', {
      items: toDos
    });

    toDosList.on('change', function(data){
      localStorage.setItem('to_dos', JSON.stringify(data));
    });

    // render our view
    view.set('task', '', false);
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

    // check for none blank task string
    if(task === ''){
      view.find('.new-input').focus();
      return;
    }

    // create our task object
    var toDo = {
      'id': id,
      'task': task
    };

    // update locally stored unique id
    id ++;
    localStorage.setItem('id', id);

    // clear input and insert item in list
    view.set('task', '', false);
    view.find('.new-input').focus();
    toDosList.add(toDo);
  };


});
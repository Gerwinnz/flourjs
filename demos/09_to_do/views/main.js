
flour.addView('main', function(){

  var view = this;
  var myApp = null;

  view.template = 'main';

  // events
  view.events = {
    'submit form': 'addTask',
    'change .complete-to-do': 'completeTask',
    'click .delete-to-do': 'deleteTask'
  };


  // privates
  var newList = null;
  var toDosList = null;
  var id = 0;


  // init
  view.init = function(params){
    var toDos = localStorage.getItem('to_dos');
    id = localStorage.getItem('id');

    // set defaults
    if(toDos === null){
      toDos = [];
    }else{
      toDos = JSON.parse(toDos);
    }

    if(id === null){
      id = 0;
    }

    newList = flour.getList('to_dos', {
      items: toDos
    });

    newList.on('change', function(data){
      console.log('change', data);
    });

    // create new flour.list
    // toDosList = new flour.list(toDos, {
    //   key: 'id',
    //   template: 'to_do',
    //   itemClass: 'to-do-item',

    //   // save our data when it changes
    //   onChange: function(data){
    //     localStorage.setItem('to_dos', JSON.stringify(data));
    //   }
    // });

    // render our view
    view.set('task', '', false);
    view.render();
  };


  // post render
  view.postRender = function(){
    view.find('.to-dos-list').append(newList.el);
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
    newList.add(toDo);
  };


  // mark a task as complete
  view.completeTask = function(event, el){
    var value = el.prop('checked');
    var id = el.data('id');
    newList.update(id, 'complete', value);
  }


  // delete item
  view.deleteTask = function(event, el){
    var id = el.data('id');
    newList.remove(id);
  };

});
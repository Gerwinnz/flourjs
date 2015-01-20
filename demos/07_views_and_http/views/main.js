
flour.addView('main', function(){

  var view = this;

  view.template = 'main';

  view.events = {
    'click .delete-dwarf': 'deleteDwarf',
    'click .get-dwarves': 'getDwarves'
  };

  // api calls
  var getDwarves = flour.http(flour.config('base_url') + '/api/dwarves.json', 'get');

  // init
  view.init = function(params){
    view.render();
  };


  // get dwarves
  view.getDwarves = function(event, el){
    getDwarves({}, {
      success: function(response){
        view.set('dwarves', response.dwarves);
      }
    });
  };

  // delete a dwarf
  view.deleteDwarf = function(event, el){
    var dwarves = view.get('dwarves');
    var index = el.data('index');
    var dwarf = dwarves[index];

    dwarves.splice(index, 1);
    view.set('dwarves', dwarves);
  };


});
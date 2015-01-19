
flour.addView('main', function(){

  var view = this;

  view.template = 'main';

  view.helpers = [
    'pulldown_menu'
  ];

  view.events = {
    'click .delete-dwarf': 'deleteDwarf'
  };

  // api calls
  var getDwarves = flour.http(flour.config('base_url') + '/api/dwarves.json', 'get');

  // init
  view.init = function(params){
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

    var confirmView = view.getView('confirm', 'Are you sure you want to delete ' + dwarf.name + '?');
    view.el.append(confirmView.el);

    confirmView.on('yes', function(){
      dwarves.splice(index, 1);
      view.set('dwarves', dwarves);
    });
  };


});

flour.addView('main', function(){

  var view = this;

  view.template = 'main';

  view.events = {
    'click .delete-dwarf': 'deleteDwarf'
  };

  view.init = function(params){
    var dwarves = [
      {'name': 'Bifur'},
      {'name': 'Bofur'},
      {'name': 'Thorin'},
      {'name': 'Fili'},
      {'name': 'Kili'},
    ];

    view.set('dwarves', dwarves);
  };



  view.deleteDwarf = function(event, el){
    var dwarves = view.get('dwarves');
    var index = el.data('index');
    var dwarf = dwarves[index];

    var confirmView = view.getView('confirm', 'Are you sure you want to delete ' + dwarf.name + ' from your party?');
  };

});

flour.addView('main', function(){

  var view = this;

  view.template = 'main';

  view.helpers = [
    'pulldown_menu'
  ];

  view.events = {
    'click .delete-dwarf': 'deleteDwarf'
  };


  // init
  view.init = function(params){
    var dwarves = [
      {'name': 'Thorin'},

      {'name': 'Fili'},
      {'name': 'Kili'},

      {'name': 'Balin'},
      {'name': 'Dwalin'},
      {'name': 'Oin'},
      {'name': 'Gloin'},

      {'name': 'Dori'},
      {'name': 'Nori'},
      {'name': 'Ori'},

      {'name': 'Bifur'},
      {'name': 'Bofur'},
      {'name': 'Bombur'}
    ];

    view.set('dwarves', dwarves);
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
var templates = {};


$(function(){

  // Load templates into templates object
  var mainSource = $("#main-template").html();
  templates['main'] = Handlebars.compile(mainSource);


  // Create instance of our view
  var mainView = flour.getView('main', {
    'name': 'world'
  });

  // Add to our page
  $('#app').append(mainView.el);

});
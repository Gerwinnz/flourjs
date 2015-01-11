var templates = {};


$(function(){

  // Load templates into templates object
  var $templates = $('.template');
  $.each($templates, function(index, template){
    var $template = $(template);
    var name = $template.data('name');
    var html = $template.html();

    templates[name] = Handlebars.compile(html);
  });


  // Set our default user info
  flour.store.set('user', {
    'first_name': 'Gandalf',
    'last_name': 'the Grey',
    'email': 'gandalf@whitecouncil.com'
  });


  // Create instance of our views
  var mainView = flour.getView('main', {});

  // Add to our page
  $('#main-view').append(mainView.el);

});
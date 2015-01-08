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
    'first_name': 'Chip',
    'last_name': 'Chipperson',
    'email': 'chip@gmail.com'
  });


  // Create instance of our views
  var navView = flour.getView('nav', {});
  var mainView = flour.getView('main', {});
  var formView = flour.getView('form', {});

  // Add to our page
  $('#nav-view').append(navView.el);
  $('#main-view').append(mainView.el);
  $('#form-view').append(formView.el);

});
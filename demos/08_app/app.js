$(function(){

  // Add our templates
  var $templates = $('.template');
  $.each($templates, function(index, template){
    var $template = $(template);
    flour.addTemplate($template.data('name'), $template.html());
  });

  // Set base url - required when using the app
  var baseURL = document.URL.replace(/08_app\/.+/, '08_app');
  flour.config('base_url', baseURL);

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
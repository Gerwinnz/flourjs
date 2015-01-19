$(function(){

  // Add our templates
  var $templates = $('.template');
  $.each($templates, function(index, template){
    var $template = $(template);
    flour.addTemplate($template.data('name'), $template.html());
  });

  // Set base url - required when using the app
  var baseURL = document.URL.replace(/07_views_and_http\/.+/, '07_views_and_http');
  flour.config('base_url', baseURL);

  // Set our default user info
  flour.store.set('user', {
    'first_name': 'Gandalf',
    'last_name': 'the Grey',
    'email': 'gandalf@whitecouncil.com'
  });


  // Create instance of our views
  var navView = flour.getView('nav', {});
  var mainView = flour.getView('main', {});

  // Add to our page
  $('#nav-view').append(navView.el);
  $('#main-view').append(mainView.el);

});
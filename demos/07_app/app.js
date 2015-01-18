$(function(){

  // Add our templates
  var $templates = $('.template');
  $.each($templates, function(index, template){
    var $template = $(template);
    flour.addTemplate($template.data('name'), $template.html());
  });


  // Set base url - required when using the app
  var baseURL = document.URL.replace(/07_app\/.+/, '07_app');

  flour.config('base_url', baseURL);

  // Set our default user info
  flour.store.set('user', {
    'first_name': 'Chip',
    'last_name': 'Chipperson',
    'email': 'chip@gmail.com'
  });

  // Create instance of our views
  var navView = flour.getView('nav', {});
  var mainView = flour.getView('main', {});

  // Add to our page
  $('#nav-view').append(navView.el);
  $('#main-view').append(mainView.el);

});
$(function(){

  // Add our templates
  var $templates = $('.template');
  $.each($templates, function(index, template){
    var $template = $(template);
    flour.addTemplate($template.data('name'), $template.html());
  });


  // Set base url - required when using the app
  var baseURL = document.URL.replace(/07_views_and_http.+/, '07_views_and_http');
  flour.config('base_url', baseURL);


  // Create instance of our views
  var mainView = flour.getView('main', {});


  // Add to our page
  $('#main-view').append(mainView.el);

});
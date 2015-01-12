$(function(){

  // Add our templates
  var $templates = $('.template');
  $.each($templates, function(index, template){
    var $template = $(template);
    flour.addTemplate($template.data('name'), $template.html());
  });


  // Create instance of our view
  var mainView = flour.getView('main', {
    'name': 'world'
  });

  // Add to our page
  $('#app').append(mainView.el);

});
$(function(){

  // Add our templates
  var $templates = $('.template');
  $.each($templates, function(index, template){
    var $template = $(template);
    flour.addTemplate($template.data('name'), $template.html());
  });


  // Create instance of our views
  var mainView = flour.getView('main', {
    'name': 'world'
  });

  var formView = flour.getView('form', {});

  // Add to our page
  $('#main-view').append(mainView.el);
  $('#form-view').append(formView.el);

});
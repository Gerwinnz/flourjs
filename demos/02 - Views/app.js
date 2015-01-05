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


  // Create instance of our views
  var mainView = flour.getView('main', {
    'name': 'world'
  });

  var formView = flour.getView('form', {});

  // Add to our page
  $('#main-view').append(mainView.el);
  $('#form-view').append(formView.el);

});
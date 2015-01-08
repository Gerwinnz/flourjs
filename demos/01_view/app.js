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


  // Create instance of our view
  var mainView = flour.getView('main', {
    'name': 'world'
  });

  // Add to our page
  $('#app').append(mainView.el);

});
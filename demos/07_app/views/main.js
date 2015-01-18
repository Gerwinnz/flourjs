
flour.addView('main', function(){

  var view = this;
  var myApp = null;

  view.template = 'main';


  // events
  view.events = {
    'click .nav-link': 'goTo'
  };


  // init
  view.init = function(params){
    myApp = flour.app('My Application', {
      routes: {
        '/settings': {view: 'settings'},
        '/:page': {view: 'page'}
      }
    });

    view.render();
  };


  // after render
  view.postRender = function(){
    view.find('#app').append(myApp.el);
  };


  // fire links
  view.goTo = function(event, el){
    event.stopPropagation();
    event.preventDefault();

    flour.pushState(flour.config('base_url') + el.attr('href'));
  };

});
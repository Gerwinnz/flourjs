
flour.addView('confirm', function(){

  var view = this;

  view.template = 'confirm';

  view.events = {
    'click .confirm-no': 'no',
    'click .confirm-yes': 'yes',
    'click .confirm-outer': 'no'
  };

  view.init = function(message){
    view.set('message', message);
  };

  // no button
  view.no = function(event, el){
    view.close('no');
  };

  // yes button
  view.yes = function(event, el){
    view.close('yes');
  };

  // remove
  view.close = function(trigger){
    var $confirm = view.find('.confirm');
    $confirm.removeClass('bounceIn');
    $confirm.addClass('bounceOut');

    $confirm.one("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd", function(){ 
      view.trigger(trigger);
      view.destroy();
    });
  };

  view.postDestroy = function(){
    view.el.remove();
  };
});

flour.addHelper('pulldown_menu', function(){

  var helper = this;

  var $lastOpened = false;

  
  // simply close the last opened menu on document click
  $(document.body).click(function(){
    if($lastOpened){
      $lastOpened.removeClass('open');
    }
  });


  helper.init = function(view){

    // add an event to our calling view
    view.events['click .pulldown-toggle'] = function(event, el){

      // prevent this from propagating up to the document body
      event.preventDefault();
      event.stopPropagation();

      // check for open state
      if(el.hasClass('open')){
        el.removeClass('open');
      }else{
        if($lastOpened){
          $lastOpened.removeClass('open');
        }
        el.addClass('open');
        $lastOpened = el;
      }
    };
  };
  
});
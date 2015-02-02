
var flour = flour || {};



//
//  
//
flour.addBinder('html', 
{
  change: function($el, data)
  {
    $el.html(data);
  }
});




//
//  
//
flour.addBinder('text', 
{
  change: function($el, data)
  {
    $el.text(data);
  }
});




//
//  
//
flour.addBinder('model', 
{
  load: function($el, onChange)
  {
    var type = $el[0].nodeName;

    if(type === 'INPUT' || type === 'TEXTAREA')
    {
      var inputType = $el[0].type;

      if(inputType === 'checkbox')
      {
        $el.on('change', function(event)
        {             
          var val = ($el.prop('checked'));
          onChange(val);
        });
      }
      else if(inputType === 'radio')
      {
        $el.on('change', function(event)
        {
          var val = $el.val();
          onChange(val);
        });
      }
      else
      {
        $el.on('keypress change keyup', function(event)
        {
          var val = $el.val();
          onChange(val);
        });
      }
    }

    if(type === 'SELECT'){
      $el.on('change', function(event)
      {
        var val = $el.val();
        onChange(val);
      });
    }
  },
  

  change: function($el, data)
  {
    var $type = $el[0].nodeName;
    var $inputType = $el[0].type;

    if($inputType === 'checkbox'){
      $el.prop('checked', data);

    }else if($el.attr('type') === 'radio'){
      if($el.val() === data){
        $el.prop('checked', true);
      }

    }else{
      if($el.val() !== data){
        $el.val(data);
      }
    }
  }
});




//
//
//
flour.addBinder('show', 
{
  change: function($el, data)
  {
    if(data){
      $el.css('display', 'block');
    }else{
      $el.css('display', 'none');
    }
  }
});




//
//
//
flour.addBinder('hide', 
{
  change: function($el, data)
  {
    if(data){
      $el.css('display', 'none');
    }else{
      $el.css('display', 'block');
    }
  }
});




//
//
//
flour.addBinder('class', 
{
  change: function($el, data)
  {
    var lastClass = $el.data('last-class');
    if(lastClass){
      $el.removeClass(lastClass);
    }

    $el.data('last-class', data);
    $el.addClass(data);
  }
});


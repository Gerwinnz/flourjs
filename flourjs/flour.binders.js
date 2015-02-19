
var flour = flour || {};



//
//  Sets passed elements innerHTML to the data
//
flour.addBinder('html', 
{
  update: function($el, data)
  {
    $el.html(data);
  }
});




//
//  Sets passed elements text to the data
//
flour.addBinder('text', 
{
  update: function($el, data)
  {
    $el.text(data);
  }
});




//
//  Sets the value of a form element to the data and also
//  adds change event listeners and updates the model
//
flour.addBinder('value', 
{
  attach: function($el, binding, view)
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
          view.set(binding, val, false);
        });
      }
      else if(inputType === 'radio')
      {
        $el.on('change', function(event)
        {
          var val = $el.val();
          view.set(binding, val, false);
        });
      }
      else
      {
        $el.on('keypress change keyup', function(event)
        {
          var val = $el.val();
          view.set(binding, val, false);
        });
      }
    }

    if(type === 'SELECT')
    {
      $el.on('change', function(event)
      {
        var val = $el.val();
        view.set(binding, val, false);
      });
    }
  },
  

  update: function($el, data)
  {
    var $type = $el[0].nodeName;
    var $inputType = $el[0].type;

    if($inputType === 'checkbox')
    {
      $el.prop('checked', data);
    }
    else if($el.attr('type') === 'radio')
    {
      if($el.val() === data)
      {
        $el.prop('checked', true);
      }
    }
    else
    {
      if($el.val() !== data)
      {
        $el.val(data);
      }
    }
  }
});




//
//  Shows and hides the passed element depending on the data
//
flour.addBinder('show', 
{
  update: function($el, data)
  {
    if(data)
    {
      $el.css('display', 'block');
    }
    else
    {
      $el.css('display', 'none');
    }
  }
});




//
//  Hides and shows the passed element depending on the data
//
flour.addBinder('hide', 
{
  update: function($el, data)
  {
    if(data)
    {
      $el.css('display', 'none');
    }
    else
    {
      $el.css('display', 'block');
    }
  }
});




//
//  Straight up adds the class to the passed element from the data
//
flour.addBinder('class', 
{
  update: function($el, data)
  {
    var lastClass = $el.data('last-class');
    if(lastClass)
    {
      $el.removeClass(lastClass);
    }

    $el.data('last-class', data);
    $el.addClass(data);
  }
});


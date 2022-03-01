

/*
|
|
| Text area auto resize
|
|
*/
flour.binding.add('auto-resize', 
{
  attach: function(element, state, view)
  {
    element.style.overflow = 'hidden';
    
    element.addEventListener('input', function()
    {
      element.style.height = 0;
      element.style.height = element.scrollHeight + 'px';
    });

    
    if(element.hasAttribute('f-value'))
    {
      state.onChange(element.getAttribute('f-value'), function(){
        element.style.height = element.scrollHeight + 'px';
      });
    }
  }
});
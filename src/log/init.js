



/*
|
|
|	Insert CSS
|
|
*/
var styleTag = document.createElement("style");
styleTag.innerHTML = '<%= css %>';
document.getElementsByTagName("head")[0].appendChild(styleTag);



/*
|
|
| Create logView and append to body
|
|
*/
flour.logView = flour.getView('flour_log');


$(function(){ 

	window.onerror = function (msg, url, lineNo, columnNo, error) 
  {
    var string = msg.toLowerCase();
    var substring = "script error";
    if(string.indexOf(substring) > -1)
    {
      flour.error('Script Error: See Browser Console for Detail');
    } 
    else
    {
      url = url.split('/').pop();
      flour.error((msg + '<br />' +  url + ' (' + lineNo + ', ' + columnNo + ')'), JSON.stringify(error));
    }

    return false;
  };

	$('body').append(flour.logView.el); 
});


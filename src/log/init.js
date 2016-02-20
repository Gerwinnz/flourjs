



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
	$('body').append(flour.logView.el); 
});


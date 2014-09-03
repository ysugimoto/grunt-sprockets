//= require src/script1.js
//= require src/script1.js

//= if !sample
document.addEventListener('DOMContentLoaded', function(evt) {
	callScript1();
	callScript2();
}, false);

//= end

//= require src/script2.js

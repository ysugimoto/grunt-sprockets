function callScript1() {
	console.log('This is Script 1.');
};


document.addEventListener('DOMContentLoaded', function(evt) {
	callScript1();
	callScript2();
}, false);

function callScript2() {
	console.log('This is Script 2.');
};


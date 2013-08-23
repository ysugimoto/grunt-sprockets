var buster    = require('buster');
var assert    = buster.assertions.assert;
var refute    = buster.assertions.refute;
var Sprockets = require('../tasks/sprockets');
var grunt     = require('grunt');

buster.testCase('SprocketsTest', {
	
	"resolveDepenencyRequire#Success" : function() {
		var result = Sprockets.resolveDepenencyRequire('sample/test.js');
		
		assert.isString(result);
	},
	
	"resolveDepenencyRequire#Failed" : function() {
		var result = Sprockets.resolveDepenencyRequire('sample/notfound.js');
		
		refute.defined(result);
	},
	
	"loadDirectoryFiles#Success" : function() {
		var result = Sprockets.loadDirectoryFiles('sample/src');
		
		assert.isArray(result);
	},
	
	"loadDirectoryFiles#Failed" : function() {
		var result = Sprockets.loadDirectoryFiles('sample/notfound');
		
		assert.equals(result, "");
	}
});

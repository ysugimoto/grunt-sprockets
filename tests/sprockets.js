var buster    = require('buster');
var assert    = buster.assertions.assert;
var refute    = buster.assertions.refute;
var Sprockets = require('../tasks/sprockets');

buster.testCase('SprocketsTest', {
	
	"resolveDepenencyRequire#Success" : function() {
		Sprockets.options = {
			banner: '',
			footer: '',
			assertMark: false,
			allowDuplicateRequire: false,
			compare: [],
			mark: false
		};
		var result = Sprockets.resolveDepenencyRequire('sample/test.js');
		
		assert.isString(result);
	},
	
	"resolveDepenencyRequire#Failed" : function() {
		var result = Sprockets.resolveDepenencyRequire('sample/notfound.js');
		
		refute.defined(result);
	},
	
	"loadDirectoryFiles#Success" : function() {
		Sprockets.options = {
			banner: '',
			footer: '',
			assertMark: false,
			allowDuplicateRequire: true,
			compare: [],
			mark: false
		};
		var result = Sprockets.loadDirectoryFiles('sample/src');
		
		assert.isArray(result);
	},
	
	"loadDirectoryFiles#Failed" : function() {
		var result = Sprockets.loadDirectoryFiles('sample/notfound');
		
		assert.equals(result, "");
	},
	"inArray#Success" : function() {
		var result = Sprockets.inArray(['aaa', 'bbb'], 'aaa');
		
		assert.isTrue(result);
	},
	"inArray#Failed" : function() {
		var result = Sprockets.inArray(['aaa', 'bbb'], 'ccc');
		
		assert.isFalse(result);
	}
});

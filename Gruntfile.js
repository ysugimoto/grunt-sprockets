module.exports = function(grunt) {
	
	// Sample
	grunt.initConfig({
		assets: {
			files: ['sample/test.js'],
			dest: 'out/assets.js'
		}
	});
	
	grunt.loadTasks('tasks');
	grunt.registerTask('default', ['assets']);
};

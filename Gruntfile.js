module.exports = function(grunt) {
	
	// Sample
	grunt.initConfig({
		sprockets: {
			files: ['sample/test.js'],
			dest: 'out/assets.js'
		}
	});
	
	grunt.loadTasks('tasks');
	grunt.registerTask('default', ['sprockets']);
};

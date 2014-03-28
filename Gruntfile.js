module.exports = function(grunt) {
	
	// Sample
	grunt.initConfig({
		sprockets: {
			sample: {
				files: ['sample/test.js'],
				dest: 'out/assets.js'
			},
			sample2: {
				files: ['sample/test.js'],
				dest: 'out/assets2.js'
			}
		}
	});
	
	grunt.loadTasks('tasks');
	grunt.registerTask('default', ['sprockets']);
};

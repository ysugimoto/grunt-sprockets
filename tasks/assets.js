/**
 * Asset managemnet task supply
 * 
 * Supply require external files
 * with "//= rquire[_tree]" format like rails.
 * 
 * @usage
 * put formatted comment on your code:
 * 
 * //= require sample.js
 * //= require_tree foo
 * 
 * On task end, create file that resolved dependency.
 * 
 * @params
 * enable following paramters at grunt.config:
 * 
 * Array   files (required) : target files array
 * String  dest  (required) : save destination filename
 * Boolean mark  (optional) : marking included filename on script
 * 
 * @author Yoshiaki Sugimoto <neo.yoshiaki.sugimoto@gmail.com>
 */

module.exports = function(grunt) {
	
	// Mark the inclided file name ( for debug )
	var mark;
	
	// Register task "assets"
	grunt.registerTask('assets', 'resolve dependency asset', function()  {
		
		var conf  = grunt.config('assets'),
		    base  = conf.base || process.cwd(),
		    files = conf.files,
		    out   = "";
		
		mark = conf.assetMark || false;
		
		if ( ! files ) {
			grunt.log.errorlns('target files is not defined.');
			return;
		}
		
		files.forEach(function(file) {
			// Resolve dependency files
			out += resolveDepenencyRequire(file);
		});
		
		grunt.log.writeln('Build file: ' + conf.dest + ' ...');
		grunt.file.write(conf.dest, out);
		grunt.log.writeln('Task:assets finished.');
	});
	
	
	/**
	 * Resolve Dependency requires
	 * 
	 * @param  string  file   : load target file
	 * @param  boolean isTree : flag of tree requires
	 * @return string  buffer : resolved code buffer
	 */
	function resolveDepenencyRequire(file, isTree) {
		var dirs, dir, buffer;
			
		if ( ! grunt.file.exists(file) ) {
			grunt.log.error('Warning: ' + file + ' is not exists.');
			return;
		}
		grunt.log.writeln('Processing: "' + file + '" ...');
		
		// Get dirname
		dirs = file.split('/');
		dirs.pop();
		
		buffer = ( isTree )
		           ? loadDirectoryFiles(file).join("")
		           : (( mark ) ? "//---- require from " + file + "\n" : "") + grunt.file.read(file);
		
		// Resolve dependecy
		return buffer.replace(/^\/\/=\srequire(_tree)?(?:\s+)?(.+)$/mg, function(match, isTree, filePath) {
			
			var path = dirs.join('/') + '/' + filePath;
			
			if ( ! grunt.file.exists(path) ) {
				grunt.log.error('Warning: ' + path + ' is not exists.');
				return "";
			}
			
			if ( isTree ) {
				grunt.log.oklns(path + ' tree is loaded.');
				return resolveDepenencyRequire(path, isTree);
			} else {
				grunt.log.oklns(path + ' is loaded.');
				return grunt.file.read(path);
			}
		});
	}
	
	/**
	 * Resolve Dependency from directory tree
	 * 
	 * @param string path   : directory path
	 * @return Array buffer : code buffer array
	 */
	function loadDirectoryFiles(path) {
		var files,
		    buffer = [];
		
		if ( ! grunt.file.isDir(path) ) {
			grunt.log.errorlns('Error: ' + path + ' is not a directory.');
			return "";
		}
		
		files = grunt.file.expand({}, path.replace(/\/$/, "") + '/*');
		files.forEach(function(file) {
			
			if ( grunt.file.isFile(file) ) {
				mark && buffer.push("//---- require from " + file + "\n");
				buffer.push(grunt.file.read(file));
				grunt.log.oklns(file + ' is loaded.');
			}
			
		});
		
		return buffer;
	}
};

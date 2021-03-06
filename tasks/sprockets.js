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

module.exports = Sprockets;

var grunt = require('grunt');

function Sprockets() {

    grunt.registerMultiTask('sprockets', 'Resolve dependenct assets', function() {
        var options = this.options({
                banner: '',
                footer: '',
                assertMark: false,
                allowDuplicateRequire: true,
                compare: [],
                mark: false
            }),
            out    = "",
            banner = grunt.template.process(options.banner),
            footer = grunt.template.process(options.footer),
            files  = this.data.files,
            dest   = this.data.dest;

        if ( ! files ) {
            grunt.log.errorlns('target files is not defined.');
            return;
        }

        Sprockets.loadedFiles = [];
        Sprockets.options = options;

        files.forEach(function(file) {
            // Resolve dependency files
            out += Sprockets.resolveDepenencyRequire(file);
        });

        grunt.log.writeln('Build file: ' + dest + ' ...');
        grunt.file.write(dest, banner + out + footer);
    });
}

Sprockets.loadedFiles = [];

/*
 *e Dependency requires
 * 
 * @param  string  file    : load target file
 * @param  boolean istree  : flag of tree requires
 * @return string  buffer  : resolved code buffer
 */
Sprockets.resolveDepenencyRequire = function(file, isTree) {
    var dirs, buffer;

    if ( ! grunt.file.exists(file) ) {
        grunt.log.error('[Warning]: ' + file + ' is not exists.');
        return;
    }

    // check duplicate require
    if ( Sprockets.inArray(Sprockets.loadedFiles, file) ) {
        if ( Sprockets.options.allowDuplicateRequire === false ) {
            grunt.log.warn('[Skipped]: ' + file + ' has duplicated require.');
            return;
        }
    }

    grunt.log.writeln('[Processing]: "' + file + '" ...');

    // Get dirname
    dirs = file.split('/');
    dirs.pop();

    // tree or file require
    if ( isTree ) {
        buffer = Sprockets.loadDirectoryFiles(file).join("");
    } else {
        buffer = (( Sprockets.options.mark ) ? "//---- require from " + file + "\n" : "") + grunt.file.read(file);
        Sprockets.loadedFiles.push(file);
    }

    // remove compared sectionlog
    buffer = buffer.replace(/\/\/=\sif\s+(!)?\s?(.+)([\s\S]*?)\n\/\/=\send/g, function(match, not, cond, source) {
        if ( ! not ) {
            return ( Sprockets.inArray(Sprockets.options.compare, cond) ) ? source : "";
        } else {
            return ( Sprockets.inArray(Sprockets.options.compare, cond) ) ? "" : source;
        }
    });

    // Resolve dependecy
    buffer = buffer.replace(/^\/\/=\srequire(_tree)?(?:\s+)?(.+)$/mg, function(match, isTree, filePath) {
        var path = dirs.join('/') + '/' + filePath;

        if ( ! grunt.file.exists(path) ) {
            grunt.log.warn('[Warning]: ' + path + ' is not exists.');
            return "";
        }

        if ( isTree ) {
            return Sprockets.resolveDepenencyRequire(path, true);
        } else {
            return Sprockets.resolveDepenencyRequire(path);
        }
    });

    return buffer;
};

/**
 * Resolve Dependency from directory tree
 * 
 * @param string path   : directory path
 * @return Array buffer : code buffer array
 */
Sprockets.loadDirectoryFiles = function(path) {
    var files,
        buffer = [];

    if ( ! grunt.file.isDir(path) ) {
        grunt.log.errorlns('[Error]: ' + path + ' is not a directory.');
        return "";
    }

    files = grunt.file.expand({}, path.replace(/\/$/, "") + '/*');
    files.forEach(function(file) {
        if ( grunt.file.isFile(file) ) {
            Sprockets.options.mark && buffer.push("//---- require from " + file + "\n");
            buffer.push(grunt.file.read(file));
            grunt.log.oklns('[Info]: ' + file + ' is loaded.');
        }
    });

    return buffer;
};

/**
 * Utility inArray
 * 
 * @param  array  haystack
 * @param  string needle
 * @return bool
 */
Sprockets.inArray = function(haystack, needle) {
    var ind  = -1;

    while ( haystack[++ind] ) {
        if ( haystack[ind] === needle ) {
            return true;
        }
    }

    return false;
};

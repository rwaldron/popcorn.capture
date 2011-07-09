var // Program refs
fs = require("fs"),
sys = require("sys"),
uglify = require("uglify-js"),
jshint = require("jshint").JSHINT,
print = require("sys").print,
util = require("util"),
exec = require("child_process").exec,
child;

// Global constants
const _FILES_ = {
				src: [
					"popcorn.capture.js"
				]
			},
			_SRC_ = "src/",
			_DIST_ = "dist/";

const _PROJECT_ = "popcorn.capture";


desc("Uglify JS");
task("minify", [ "hint" ], function( params ) {

	print( "\nUglifying..." );

	var ast, out,
	files = _FILES_;


	for ( var type in files ) {

		var _files = files[ type ],
		all = "";

		// Concatenate JavaScript resources
		_files.forEach(function(file, i) {
			if ( file.match(/^.*js$/) && file ) {
				all += fs.readFileSync( _SRC_ + file ).toString();
			}
		});

		// Outout concatenated
		out = fs.openSync( _DIST_ + _PROJECT_ + ".js", "w+" );
		fs.writeSync( out, all );

		// Create AST from concatenated sources
		ast = uglify.parser.parse( all );

		// Open output stream
		out = fs.openSync( _DIST_ + _PROJECT_ + ".min.js", "w+" );

		// Compress AST
		ast = uglify.uglify.ast_mangle( ast );
		ast = uglify.uglify.ast_squeeze( ast );

		// Output regenerated, compressed code
		fs.writeSync( out, uglify.uglify.gen_code( ast ) );
	}


	print( "Success!\n" );
});

desc("JSHint");
task("hint", [], function( params ) {

	print( "\nHinting...\n" );

	var files = _FILES_;

	function hintFile( file ) {
		var src = fs.readFileSync( _SRC_ + file, "utf8"),
		ok = {
			// warning.reason
			"Expected an identifier and instead saw 'undefined' (a reserved word).": true,
			"Use '===' to compare with 'null'.": true,
			"Use '!==' to compare with 'null'.": true,
			"Expected an assignment or function call and instead saw an expression.": true,
			"Expected a 'break' statement before 'case'.": true,
			"'e' is already defined.": true,

			// warning.raw
			"Expected an identifier and instead saw \'{a}\' (a reserved word).": true
		},
		found = 0, errors, warning;

		jshint( src, { evil: true, forin: false, maxerr: 100 });

		errors = jshint.errors;


		for ( var i = 0; i < errors.length; i++ ) {
			warning = errors[i];

			if ( warning ) {
				//print( w );
				if ( !ok[ warning.reason ] && !ok[ warning.raw ] ) {
					found++;

					print( "\n" + file + " at L" + warning.line + " C" + warning.character + ": " + warning.reason );
					print( "\n" + warning.evidence + "\n");

				}
			}
		}
		if ( found > 0 ) {
			print( "\n\n" + found + " Error(s) found.\n" );

		} else {
			print( "    " + file + " => Success!\n" );
		}
	}

	files.src.forEach(function( file, i ) {

		hintFile( file );
	})

});

task("clean", [], function( params ) {

	print( "\nCleaning...\n\n" );

	_FILES_.src.forEach(function( file, i ) {


		exec("rm " + _DIST_ + file,
			function( error, stdout, stderr ) {

				if ( error !== null && !/No such file/.test( error ) ) {
					console.log( error );
				} else {
					// no such file errors will be allowed through, just ignore them
					if ( error !== null ) {
						console.log("  deleted: " + file );
					}
				}
			}
		);

		if ( files.length - 1 === i ) {
			print("Completed.\n");
		}
	});
});

task("default", [ "hint", "minify" ], function( params ) {

	print( "\n" );

});
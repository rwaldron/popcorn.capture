var // Program refs
fs = require("fs"),
sys = require("util"),
uglify = require("uglify-js"),
jshint = require("jshint").JSHINT,
print = require("sys").print,
util = require("util"),
exec = require("child_process").exec,
child;

const FILES = {
	src: [
		"popcorn.capture.js"
	]
},
SRC_DIR = "src/",
DIST_DIR = "dist/",
PROJECT = "popcorn.capture";


desc("Uglify JS");
task("minify", [ "hint" ], function( params ) {

	print( "\nUglifying..." );

	var ast, out,
	files, type;

	for ( type in FILES ) {

		all = "";

		// Concatenate JavaScript resources
		FILES[ type ].forEach(function( file, i ) {
			if ( file.match(/^.*js$/) && file ) {
				all += fs.readFileSync( SRC_DIR + file ).toString();
			}
		});

		// Outout concatenated
		out = fs.openSync( DIST_DIR + PROJECT + ".js", "w+" );
		fs.writeSync( out, all );

		// Create AST from concatenated sources
		ast = uglify.parser.parse( all );

		// Open output stream
		out = fs.openSync( DIST_DIR + PROJECT + ".min.js", "w+" );

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

	function hintFile( file ) {
		var src = fs.readFileSync( SRC_DIR + file, "utf8"),
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

	FILES.src.forEach(function( file, i ) {

		hintFile( file );
	})

});

task("clean", [], function( params ) {

	print( "\nCleaning...\n\n" );

	FILES.src.forEach(function( file, i ) {


		exec("rm " + DIST_DIR + file,
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
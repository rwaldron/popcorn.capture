/*!
 * Popcorn.prototype.capture()
 *
 * Copyright 2011, Rick Waldron
 * Licensed under MIT license.
 *
 */

// Requires Popcorn.js
/* global Popcorn: true */
(function( global, Popcorn ) {

	var doc = global.document,
		defaults = {
			type: "png",
			// Set to poster attribute by default
			set: true,
			// Capture time, uses currentTime by default
			at: null,
			// Target selector, no target by default
			// Use by providing selector to an image element
			target: null
		};

	Popcorn.prototype.capture = function( options ) {

		var context, time, dataUrl,
			opts = Popcorn.extend( {}, defaults, options ),
			dims = this.position(),
			canvasId = "popcorn-canvas-" + this.media.id,
			canvas = doc.getElementById( canvasId );

		// If the canvas we want does not exist...
		if ( !canvas ) {

			// Create a new canvas
			canvas = doc.createElement( "canvas" );

			// Give it our known/expected ID
			canvas.id = canvasId;

			// Set it to the same dimensions as the target movie
			canvas.width = dims.width;
			canvas.height = dims.height;

			// Append it to the same parent as the target movie
			this.media.parentNode.appendChild( canvas );
		}

		// Get the canvas's context for reading/writing
		context = canvas.getContext("2d");

		// If a time is provided
		if ( opts.at ) {

			// Normalize capture time in case smpte time was given
			opts.at = Popcorn.util.toSeconds( opts.at );

			// Save the current time
			time = this.currentTime();

			// Jump to the capture time
			this.currentTime( opts.at );
		}

		// Draw the current media frame into the canvas
		context.drawImage( this.media, 0, 0, dims.width, dims.height );

		// Capture pixel data as a base64 encoded data url
		dataUrl = canvas.toDataURL( "image/" + opts );

		//console.log( dataUrl );

		// By default, we set the poster attribute of the popcorn instance
		if ( opts.set ) {
			this.media.setAttribute( "poster", dataUrl );
		}

		// If a time is provided, Restore to original time
		if ( opts.at ) {
			// Jump back to original time
			this.currentTime( time );
		}

		return dataUrl;
	};

})( this, this.Popcorn );
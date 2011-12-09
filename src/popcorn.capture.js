/*!
 * Popcorn.prototype.capture()
 *
 * Copyright 2011, Rick Waldron
 * Licensed under MIT license.
 *
 */

// Requires Popcorn.js
/* global Popcorn: true */
(function( global, Popcorn, document ) {

	var doc = document,
	defaults = {

		// Set image type, encodes as png by default
		type: "png",

		// Set to poster attribute, this occurs by default
		set: true,

		// Capture time, uses currentTime by default
		at: null,

		// Target selector, no target by default
		// Use by providing selector to an image element
		target: null,

		// Reload the video after poster is set
		// Otherwise the poster will not be displayed
		reload: true
	};

	Popcorn.prototype.capture = function( options ) {

		var context, dataUrl, seeked, targets, time,

		// Merge user options & defaults into new object
		opts = Popcorn.extend( {}, defaults, options ),

		// Media's position dimensions
		dims = this.position(),

		// Reused canvas id string
		canvasId = "popcorn-canvas-" + this.media.id,

		// The canvas element associated with this media
		canvas = doc.getElementById( canvasId );

		// If a time is provided
		if ( opts.at ) {

			// Normalize capture time in case smpte time was given
			opts.at = Popcorn.util.toSeconds( opts.at );

			// Save the current time
			time = this.currentTime();

			// Jump to the capture time
			this.currentTime( opts.at );
		}

		// If the canvas we want does not exist...
		if ( !canvas ) {

			// Create a new canvas
			canvas = doc.createElement("canvas");

			// Give it our known/expected ID
			canvas.id = canvasId;

			// Set it to the same dimensions as the target movie
			canvas.width = dims.width;
			canvas.height = dims.height;

			// Hide the canvas
			canvas.style.display = "none";

			// Append it to the same parent as the target movie
			this.media.parentNode.appendChild( canvas );
		}

		// Get the canvas's context for reading/writing
		context = canvas.getContext("2d");

		seeked = function() {

			// Draw the current media frame into the canvas
			context.drawImage( this.media, 0, 0, dims.width, dims.height );

			// Capture pixel data as a base64 encoded data url
			dataUrl = canvas.toDataURL( "image/" + opts.type );

			// If a target selector has been provided, set src to dataUrl
			if ( opts.target ) {
				targets = doc.querySelectorAll( opts.target );

				// If valid targets exist
				if ( targets.length ) {

					// Iterate all targets
					Popcorn.forEach( targets, function( node ) {

						// If target is a valid IMG element
						if ( node.nodeName === "IMG" ) {
							// Set the node's src to the captured dataUrl
							node.src = dataUrl;
						}
					});
				}
			}

			// By default, we set the poster attribute of the popcorn instance
			if ( opts.set ) {
				this.media.setAttribute( "poster", dataUrl );
			}

			// If a time is provided, Restore to original time
			if ( opts.at ) {
				// Jump back to original time
				this.listen( "loaded", function() {
					this.currentTime( time );
				});
			}

			// If a reload is provided, Restore the media
			if ( opts.reload ) {
				this.media.load();
			}

			this.unlisten( "seeked", seeked );

			this.trigger("captured");
		};

		this.listen( "seeked", seeked );

		if ( !opts.at ) {
			seeked.call( this );
		}

		return this;
	};

})( this, this.Popcorn, this.document );

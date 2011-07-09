# Popcorn.capture.js


Create data-uri png posters by capturing any frame in your video!

	var $pop = Popcorn( "#video-id" ),
		poster;

	//	Jump to the frame we want to capture and create a poster!
	poster = $pop.currentTime( 10 ).capture();



Jakefile

	jake

		(lone command will run all)

		minify  - UglifyJS on all application code
		hint    - JSHint on all application code
		clean   - delete generated files
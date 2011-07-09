var fixture, fixtureHtml,
	rdataurl = /data\:image\/png\;base64\,/;

document.addEventListener("DOMContentLoaded", function() {
	fixture = document.getElementById("unmoved-fixture");
	fixtureHtml = fixture.innerHTML;
}, false);

QUnit.begin = function() {
	fixture.innerHTML = fixtureHtml;

	Popcorn.instances = [];
	Popcorn.instanceIds = {};
};

module("API");
test("Popcorn.prototype.capture", function() {

  expect(2);

  ok( Popcorn.prototype.capture, "Popcorn.prototype.capture exists" );

  equal( typeof Popcorn.prototype.capture, "function", "Popcorn.prototype.capture() is a function" );

});

module("Functional")
test(".capture() Creates Canvas", function() {

	var $pop = Popcorn("#video-target"),
		count = 0,
		expects = 1;

	expect(1);

	function plus() {
		if ( ++count === expects ) {
			start();
		}
	}

	stop();

	$pop.listen("canplayall", function() {

		this.currentTime( 2 ).capture();

		equal( fixture.querySelectorAll("canvas").length, 1, "Calling popcornInstance.capture() creates a canvas" );
		plus();
	});
});

test(".capture() can jump to and from time", function() {

	var $pop = Popcorn("#video-target"),
		count = 0,
		expects = 1;

	expect(1);

	function plus() {
		if ( ++count === expects ) {
			start();
		}
	}

	stop();

	var startAt = 2,
		captureAt = 4;

	$pop.currentTime( startAt ).capture({
		at: captureAt
	});

	equal( $pop.currentTime(), startAt, "capture({ at: time }) can jump to specified time and correctly return to original place" );
	plus();
});

test(".capture() sets the poster attribute by default", function() {

	var $pop = Popcorn("#video-target"),
		count = 0,
		expects = 1;

	expect(1);

	function plus() {
		if ( ++count === expects ) {
			start();
		}
	}

	stop();

	var startAt = 2,
		captureAt = 4;


	$pop.currentTime( startAt ).capture({
		at: captureAt
	});

	console.log( $pop.media.getAttribute("poster") );


	ok( rdataurl.test( $pop.media.getAttribute("poster") ), "rdataurl.test( $pop.media.poster ); has data url" );
	plus();
	// $pop.listen("canplayall", function() {
	// 	$pop.currentTime( startAt ).capture({
	// 		at: captureAt
	// 	});
	//
	// 	console.log( $pop.media.getAttribute("poster") );
	//
	//
	// 	ok( rdataurl.test( $pop.media.getAttribute("poster") ), "rdataurl.test( $pop.media.poster ); has data url" );
	// 	plus();
	// });
});


//rdataUrl

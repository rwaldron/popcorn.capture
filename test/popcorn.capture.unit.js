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
test("Creates Canvas", function() {

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

test("default return", function() {

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

	var startAt = 23,
		captureAt = 4,
		dataUrl;

	dataUrl = $pop.currentTime( startAt ).capture({
		at: captureAt
	});

	ok( rdataurl.test( dataUrl ), "rdataurl.test( dataUrl ) proves data url was returned" );
	plus();
});

test("can override return for method chaining (helper for use with setting targets by selector)", function() {

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

	var startAt = 23,
		captureAt = 4,
		overridden;

	overridden = $pop.currentTime( startAt ).capture({
		media: true
	});

	deepEqual( overridden, $pop, "Setting media:true return override correctly returns the popcorn instance" );
	plus();
});

test("can jump to and from time", function() {

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

	var startAt = 23,
		captureAt = 4;

	$pop.currentTime( startAt ).capture({
		at: captureAt
	});

	equal( $pop.currentTime(), startAt, "capture({ at: time }) can jump to specified time and correctly return to original place" );
	plus();
});

test("sets the poster attribute by default", function() {

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

	var startAt = 23,
	captureAt = 4;

	function testAttr() {

		if ( $pop.media.readyState === 4 ) {

			$pop.currentTime( startAt ).capture({
				at: captureAt
			});

			ok( rdataurl.test( $pop.media.getAttribute("poster") ), "rdataurl.test( $pop.media.poster ); has data url" );
			plus();

		} else {
			setTimeout( testAttr, 10 );
		}
	}

	testAttr();
});

test("sets source of targets matching selector", function() {

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

	function testSrc() {

		if ( $pop.media.readyState === 4 ) {

			var image = document.createElement("image");

			image.id = "capture";
			image.style.marginLeft = "10px";

			$pop.media.parentNode.appendChild( image );

			$pop.exec( 25, function() {

				this.capture({
					target: "img#capture"
				});

				ok( rdataurl.test( image.src ), "rdataurl.test( image.src ); has data url" );
				plus();

			}).currentTime( 23 ).play();

		} else {
			setTimeout( testSrc, 10 );
		}
	}

	testSrc();
});

//rdataUrl

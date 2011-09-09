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

test("Returns Popcorn Instance Object", function() {

	var $pop = Popcorn("#video"),
		count = 0,
		expects = 1;

	expect(1);

	function plus() {
		if ( ++count === expects ) {
			start();
		}
	}

	stop();

	var obj;

	$pop.listen("canplayall", function() {
		obj = $pop.capture();

		deepEqual( obj, $pop, "Returns the popcorn instance" );
		plus();
	});
});

// test("default return", function() {
//
// 	var $pop = Popcorn("#video-target"),
// 		count = 0,
// 		expects = 1;
//
// 	expect(1);
//
// 	function plus() {
// 		if ( ++count === expects ) {
// 			start();
// 		}
// 	}
//
// 	stop();
//
// 	var startAt = 23,
// 		captureAt = 4,
// 		dataUrl;
//
// 	dataUrl = $pop.currentTime( startAt ).capture({
// 		at: captureAt
// 	});
//
// 	ok( rdataurl.test( dataUrl ), "rdataurl.test( dataUrl ) proves data url was returned" );
// 	plus();
// });

test("can jump to and from time", function() {

	var $pop = Popcorn("#video"),
		count = 0,
		expects = 1;

	expect(expects);

	function plus() {
		if ( ++count === expects ) {
			start();
		}
	}

	stop();

	var startAt = 0,
		captureAt = 2;

	$pop.listen("canplayall", function() {

		this.currentTime( startAt ).capture({
			at: captureAt
		}).listen( "captured", function() {

			equal( this.currentTime(), startAt, "capture({ at: time }) can jump to specified time and correctly return to original place" );
			plus();

			// equal( this.media.poster, cap, "Correct capture" );
			// plus();
		});
	});
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

	var image = document.createElement("image");

	image.id = "capture";
	image.style.marginLeft = "10px";

	$pop.media.parentNode.appendChild( image );

	$pop.listen( "canplayall", function() {

		$pop.exec( 25, function() {

			this.capture({
				target: "img#capture"
			});

			ok( rdataurl.test( image.src ), "rdataurl.test( image.src ); has data url" );
			plus();

		}).currentTime( 23 ).play();
	});
});

test("Sets the poster attribute", function() {

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

	$pop.listen( "canplayall", function() {

		this.exec( 2, function() {

			this.capture();

			ok( rdataurl.test( this.media.getAttribute("poster") ), "rdataurl.test( $pop.media.poster ); has data url" );
			plus();

		}).currentTime( 1 ).play();
	});
});


//rdataUrl

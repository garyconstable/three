/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.PointerLockControls = function ( camera, App ) {

	var scope = this;
		camera.rotation.set( 0, 0, 0 );

	var	pitchObject = new THREE.Object3D();
		pitchObject.add( camera ),
		yawObject = new THREE.Object3D();
		yawObject.position.y = 10;
		yawObject.add( pitchObject ),
		moveForward = false,
		moveBackward = false,
		moveLeft = false,
		moveRight = false,
		isOnObject = false,
		canJump = false,
		prevTime = performance.now(),
		velocity = new THREE.Vector3(),
		PI_2 = Math.PI / 2;

		this.speedMod = {
			x: 1,
			y: 1,
			z: 1,
			j: 1
		};

		this.canMoveForward = true;


		this.moveForward = false;
		this.moveBackward = false;
		this.moveLeft = false;
		this.moveRight = false;


	this.isMovingForwards = function(){
		return moveForward;
	}
	this.isMovingBackwards = function(){
		return moveBackward;
	}
	this.isMovingLeft = function(){
		return moveLeft;
	}
	this.isMovingRight = function(){
		return moveRight;
	}

	var onMouseMove = function ( event ) {

		if ( scope.enabled === false ) return;

		var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
		var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

		yawObject.rotation.y -= movementX * 0.002;
		pitchObject.rotation.x -= movementY * 0.002;

		pitchObject.rotation.x = Math.max( - PI_2, Math.min( PI_2, pitchObject.rotation.x ) );

	};

	var onKeyDown = function ( event ) {


		switch ( event.keyCode ) {

			case 38: // up
			case 87: // w
				moveForward = true;
				this.moveForward = true;
				break;

			case 37: // left
			case 65: // a
				moveLeft = true;
				this.moveLeft = true;
				break;

			case 40: // down
			case 83: // s
				moveBackward = true;
				this.moveBackward = true;
				break;

			case 39: // right
			case 68: // d
				moveRight = true;
				this.moveRight = true;
				break;

			case 32: // space
				if ( canJump === true ){
					velocity.y += 500;
				}
				canJump = false;
				break;

		}

	};

	var onKeyUp = function ( event ) {

		//console.log( 'keyup: ' + event.keyCode );

		switch( event.keyCode ) {

			case 38: // up
			case 87: // w
				moveForward = false;
				this.moveForward = false;
				break;

			case 37: // left
			case 65: // a
				moveLeft = false;
				this.moveLeft = false;
				break;

			case 40: // down
			case 83: // s
				moveBackward = false;
				this.moveBackward = false;
				break;

			case 39: // right
			case 68: // d
				moveRight = false;
				this.moveRight = false;
				break;

		}

	};

	document.addEventListener( 'mousemove', onMouseMove, false );
	document.addEventListener( 'keydown', onKeyDown, false );
	document.addEventListener( 'keyup', onKeyUp, false );

	this.enabled = false;

	this.getObject = function () {

		return yawObject;

	};

	this.isOnObject = function ( boolean ) {

		isOnObject = boolean;
		canJump = boolean;

	};

	this.getDirection = function() {

		// assumes the camera itself is not rotated

		var direction = new THREE.Vector3( 0, 0, -1 );
		var rotation = new THREE.Euler( 0, 0, 0, "YXZ" );

		return function( v ) {

			rotation.set( pitchObject.rotation.x, yawObject.rotation.y, 0 );

			v.copy( direction ).applyEuler( rotation );

			return v;

		}

	}();

	this.update = function () {

		if ( scope.enabled === false ){
			return;
		}

		var time = performance.now(),
			delta = ( time - prevTime ) / 1000;

			velocity.x -= velocity.x * 10.0 * delta;
			velocity.z -= velocity.z * 10.0 * delta;
			velocity.y -= 9.8 * 100.0 * delta;

		if ( moveForward && this.canMoveForward === true ) {
			velocity.z -= ( 400.0 * this.speedMod.z ) * delta;
		}

		if ( moveBackward) {
			velocity.z += ( 400.0 * this.speedMod.z ) *  delta;
		}

		if ( moveLeft ){
			velocity.x -= ( 400.0 * this.speedMod.x ) * delta;
		}

		if ( moveRight ){
			velocity.x += ( 400.0 * this.speedMod.x ) * delta;
		}

		if ( isOnObject === true ) {
			velocity.y = Math.max( 0, velocity.y );
		}

		yawObject.translateX( velocity.x * delta );
		yawObject.translateY( velocity.y * delta );
		yawObject.translateZ( velocity.z * delta );

		if ( yawObject.position.y < 10 ) {
			velocity.y = 0;
			yawObject.position.y = 10;
			canJump = true;
		}

		prevTime = time;

	};

};

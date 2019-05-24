import Vector from './Vector.js';
import dispatchEvent from './dispatchEvent.js';

export default class VectorAnimation {

	constructor(arg) {
		if(!arg) {
			throw new Error('please argments 引数は必須です');
		}
		this.el                     = arg.el || document.querySelector('body');
		this.stageId                = arg.stageId;
		this.location               = (arg.location)? arg.location : { x: 0, y: 0 },
		this.friction               = arg.friction || 0.9,
		this.velocity               = { x: 0, y: 0 },
		this.acceleration           = { x: 0, y: 0 },
		this.mass                   = arg.mass || 10,
		this.maxspeed               = arg.maxspeed || 10,
		this.minspeed               = arg.minspeed || 2.8;
		this.damage                 = arg.damage || 0.98,
		this.gravDistance           = arg.gravDistance || 100;
		this.gravityPoints          = arg.gravityPoints || {};
		this.currentGPointNum       = 0;
		this.vector                 = Vector;
		this.showGravityPointsColor = arg.showGravityPointsColor;

		this.gravityPoints.forEach((v, i) => {
			v.isAnimationEnd = false;
		});

		console.log(this.gravDistance)
	}

	draw() {
		return this;
	}

	update() {
	    this.velocity     = this.vector.add(this.velocity, this.acceleration);
	    this.velocity     = this.vector.mult(this.velocity, this.damage);
	    this.location     = this.vector.add(this.location, this.velocity);
	    this.acceleration = this.vector.mult(this.acceleration, 0);
		return this;
	}

	applyForce(force) {
		force = this.vector.div(force, this.mass);
		this.acceleration = this.vector.add(this.acceleration, force);
		return this;
	}

	seek(obj) {
		let arg       = obj || {};
		let g         = arg.g || this.gravityPoints[this.currentGPointNum].g;
		let direction = (arg.x && arg.y)? { x: arg.x, y: arg.y } : this.gravityPoints[this.currentGPointNum].pos;
		let sub       = this.vector.sub(direction, this.location);
		let normal    = this.vector.normalize(sub);
		let force     = this.vector.mult(normal, g);
		this.applyForce(force);
	}

	arrive(arg) {
		let gPoint  = this.gravityPoints[this.currentGPointNum];
		let sub     = this.vector.sub(gPoint.pos, this.location);
		let diff    = this.vector.mag(sub);
		let normal  = this.vector.normalize(sub);
		let desired = { x: 0, y: 0 };
		let steer   = { x: 0, y: 0 };

		if(diff < this.gravDistance) {
			let isNextPoint = (this.gravityPoints.length - 1 > this.currentGPointNum)? true : false;
			let mapedScalar = this.minspeed;

			if(isNextPoint) {
				this.currentGPointNum += 1;
				this.acceleration      = { x: 0, y: 0 };
			} else {
				mapedScalar = this.map(diff, 0, this.gravDistance, 0, 4);
			}

			desired = this.vector.mult(normal, mapedScalar);
			steer   = this.vector.sub(desired, this.velocity);
			this.applyForce(steer);

			if(!gPoint.isAnimationEnd && this.vector.mag(sub) < 1) {
				gPoint.isAnimationEnd = true;
				gPoint.callback(this);
				dispatchEvent(this.el, 'moveEnd');
			}
		} else {
			this.seek();
		}
	}

	getPoint() {
		let prop = { x: this.location.x, y: this.location.y };
		return prop;
	}
	//値を規制
	map(value, low1, high1, low2, high2) {
		let moto = high1 - low1;
		let ato  = high2 - low2;
		return (ato / moto) * value;
	}

	showGravityPoints() {
		let stage = document.getElementById(this.stageId);
		this.gravityPoints.forEach( (v, i) => {
			let gcolor = this.showGravityPointsColor;
			let color  = (gcolor)? gcolor : '#000';
			let div    = document.createElement('div');
			div.appendChild(document.createTextNode(i));
			div.style.backgroundColor = color;
			div.style.position        = 'absolute';
			div.style.left            = v.pos.x + 'px';
			div.style.top             = v.pos.y + 'px';
			div.style.width           = '20px';
			div.style.height          = '20px';
			div.style.lineHeight      = '20px';
			div.style.color           = '#fff';
			div.style.textAlign       = 'center';
			stage.appendChild(div);
		} );
	}
}

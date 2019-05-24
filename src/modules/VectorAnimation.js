import Vector from './Vector.js';
import dispatchEvent from './dispatchEvent.js';

export default class VectorAnimation {

	constructor(arg) {
		if(!arg) {
			throw new Error('argments required. 引数は必須です');
		}
		this._el                     = arg.el || document.querySelector('body');
		this._stageId                = arg.stageId;
		this._location               = (arg.location)? arg.location : { x: 0, y: 0 },
		this._friction               = arg.friction || 0.9,
		this._velocity               = { x: 0, y: 0 },
		this._acceleration           = { x: 0, y: 0 },
		this._mass                   = arg.mass || 10,
		this._maxspeed               = arg.maxspeed || 10,
		this._minspeed               = arg.minspeed || 2.8;
		this._damage                 = arg.damage || 0.98,
		this._gravDistance           = arg.gravDistance || 100;
		this._gravityPoints          = arg.gravityPoints || {};
		this._currentGPointNum       = 0;
		this._showGravityPointsColor = arg.showGravityPointsColor;
		this._isAnimationEnd         = false;
		this._infinity               = arg.infinity || false;
	}

	get el() {
		return this._el;
	}

	get stageId() {
		return this._stageId;
	}

	get currentGPointNum() {
		return this._currentGPointNum;
	}

	set currentGPointNum(num) {
		this._currentGPointNum = num;
	}

	get isAnimationEnd() {
		return this._isAnimationEnd;
	}

	set isAnimationEnd(bool) {
		this._isAnimationEnd = bool;
	}

	draw() {
		return this;
	}

	update() {
	    this._velocity     = Vector.add(this._velocity, this._acceleration);
	    this._velocity     = Vector.mult(this._velocity, this._damage);
	    this._location     = Vector.add(this._location, this._velocity);
	    this._acceleration = Vector.mult(this._acceleration, 0);
		return this;
	}

	applyForce(force) {
		force = Vector.div(force, this._mass);
		this._acceleration = Vector.add(this._acceleration, force);
		return this;
	}

	seek(obj) {
		let arg       = obj || {};
		let g         = arg.g || this._gravityPoints[this._currentGPointNum].g;
		let direction = (arg.x && arg.y)? { x: arg.x, y: arg.y } : this._gravityPoints[this._currentGPointNum].pos;
		let sub       = Vector.sub(direction, this._location);
		let normal    = Vector.normalize(sub);
		let force     = Vector.mult(normal, g);
		this.applyForce(force);
	}

	arrive(arg) {
		let gPoint  = this._gravityPoints[this._currentGPointNum];
		let sub     = Vector.sub(gPoint.pos, this._location);
		let diff    = Vector.mag(sub);
		let normal  = Vector.normalize(sub);
		let desired = { x: 0, y: 0 };
		let steer   = { x: 0, y: 0 };

		if(diff < this._gravDistance) {
			let isNextPoint = (this._gravityPoints.length - 1 > this._currentGPointNum)? true : false;
			let mapedScalar = this._minspeed;

			if(isNextPoint) {
				this._currentGPointNum += 1;
				this._acceleration      = { x: 0, y: 0 };
			}
			else if(this._infinity) {
				console.log('infinity')
				this._currentGPointNum = 0;
				this._acceleration     = { x: 0, y: 0 };
			} else {
				mapedScalar = this.map(diff, 0, this._gravDistance, 0, 4);
			}

			desired = Vector.mult(normal, mapedScalar);
			steer   = Vector.sub(desired, this._velocity);
			this.applyForce(steer);

			if(!this._isAnimationEnd && Vector.mag(sub) < 1) {
				this._isAnimationEnd = true;
				gPoint.callback(this);
				dispatchEvent(this._el, 'moveEnd');
			}
		} else {
			this.seek();
		}
	}

	getPoint() {
		let prop = { x: this._location.x, y: this._location.y };
		return prop;
	}
	//値を規制
	map(value, low1, high1, low2, high2) {
		let moto = high1 - low1;
		let ato  = high2 - low2;
		return (ato / moto) * value;
	}

	showGravityPoints() {
		let stage = document.getElementById(this._stageId);
		this._gravityPoints.forEach( (v, i) => {
			let gcolor = this._showGravityPointsColor;
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

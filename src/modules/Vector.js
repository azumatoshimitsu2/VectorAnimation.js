export default class Vector {
	static add(v1, v2) {
		x = v1.x + v2.x;
		y = v1.y + v2.y;
		return {x: x, y: y};
	}
	static sub(v1, v2) {
		x = v1.x - v2.x;
		y = v1.y - v2.y;
		return {x: x, y: y};
	}
	static mult(v, n) {
		x = v.x * n;
		y = v.y * n;
		return {x: x, y: y};
	}
	static div(v, n) {
		x = v.x / n;
		y = v.y / n;
		return {x: x, y: y};
	}
	static normalize(v) {
		var m = this.mag(v);
		if(m !== 0) {
			return this.div(v, m);
		} else {
			return v;
		}
	}
	static mag(v) {
		return Math.sqrt(v.x * v.x + v.y * v.y);
	}
};
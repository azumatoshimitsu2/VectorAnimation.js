function _classCallCheck(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function _defineProperties(t,e){for(var i=0;i<e.length;i++){var n=e[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}function _createClass(t,e,i){return e&&_defineProperties(t.prototype,e),i&&_defineProperties(t,i),t}var Vector=function(){function t(){_classCallCheck(this,t)}return _createClass(t,null,[{key:"add",value:function(t,e){return x=t.x+e.x,y=t.y+e.y,{x:x,y:y}}},{key:"sub",value:function(t,e){return x=t.x-e.x,y=t.y-e.y,{x:x,y:y}}},{key:"mult",value:function(t,e){return x=t.x*e,y=t.y*e,{x:x,y:y}}},{key:"div",value:function(t,e){return x=t.x/e,y=t.y/e,{x:x,y:y}}},{key:"normalize",value:function(t){var e=this.mag(t);return 0!==e?this.div(t,e):t}},{key:"mag",value:function(t){return Math.sqrt(t.x*t.x+t.y*t.y)}}]),t}();function dispatchEvent(t,e){if(document.createEvent)return(i=document.createEvent("HTMLEvents")).initEvent(e,!0,!0),t.dispatchEvent(i);var i=document.createEventObject();return t.fireEvent("on"+e,i)}var VectorAnimation=function(){function e(t){if(_classCallCheck(this,e),!t)throw new Error("argments required. 引数は必須です");this.el=t.el||document.querySelector("body"),this.stageId=t.stageId,this.location=t.location?t.location:{x:0,y:0},this.friction=t.friction||.9,this.velocity={x:0,y:0},this.acceleration={x:0,y:0},this.mass=t.mass||10,this.maxspeed=t.maxspeed||10,this.minspeed=t.minspeed||2.8,this.damage=t.damage||.98,this.gravDistance=t.gravDistance||100,this.gravityPoints=t.gravityPoints||{},this.currentGPointNum=0,this.showGravityPointsColor=t.showGravityPointsColor,this.isAnimationEnd=!1,this.infinity=t.infinity||!1}return _createClass(e,[{key:"draw",value:function(){return this}},{key:"update",value:function(){return this.velocity=Vector.add(this.velocity,this.acceleration),this.velocity=Vector.mult(this.velocity,this.damage),this.location=Vector.add(this.location,this.velocity),this.acceleration=Vector.mult(this.acceleration,0),this}},{key:"applyForce",value:function(t){return t=Vector.div(t,this.mass),this.acceleration=Vector.add(this.acceleration,t),this}},{key:"seek",value:function(t){var e=t||{},i=e.g||this.gravityPoints[this.currentGPointNum].g,n=e.x&&e.y?{x:e.x,y:e.y}:this.gravityPoints[this.currentGPointNum].pos,o=Vector.sub(n,this.location),s=Vector.normalize(o),a=Vector.mult(s,i);this.applyForce(a)}},{key:"arrive",value:function(t){var e=this.gravityPoints[this.currentGPointNum],i=Vector.sub(e.pos,this.location),n=Vector.mag(i),o=Vector.normalize(i),s={x:0,y:0},a={x:0,y:0};if(n<this.gravDistance){var r=this.gravityPoints.length-1>this.currentGPointNum,c=this.minspeed;r?(this.currentGPointNum+=1,this.acceleration={x:0,y:0}):this.infinity?(console.log("infinity"),this.currentGPointNum=0,this.acceleration={x:0,y:0}):c=this.map(n,0,this.gravDistance,0,4),s=Vector.mult(o,c),a=Vector.sub(s,this.velocity),this.applyForce(a),!this.isAnimationEnd&&Vector.mag(i)<1&&(this.isAnimationEnd=!0,e.callback(this),dispatchEvent(this.el,"moveEnd"))}else this.seek()}},{key:"getPoint",value:function(){return{x:this.location.x,y:this.location.y}}},{key:"map",value:function(t,e,i,n,o){return(o-n)/(i-e)*t}},{key:"showGravityPoints",value:function(){var s=this,a=document.getElementById(this.stageId);this.gravityPoints.forEach(function(t,e){var i=s.showGravityPointsColor,n=i||"#000",o=document.createElement("div");o.appendChild(document.createTextNode(e)),o.style.backgroundColor=n,o.style.position="absolute",o.style.left=t.pos.x+"px",o.style.top=t.pos.y+"px",o.style.width="20px",o.style.height="20px",o.style.lineHeight="20px",o.style.color="#fff",o.style.textAlign="center",a.appendChild(o)})}}]),e}();!function(){function t(t){console.log(t)}var e=document.querySelector(".thing"),i=document.querySelector(".thing2"),n=document.querySelector(".thing3"),o=e.style,s=i.style,a=n.style,r=[{pos:{x:300,y:300},g:1,mass:10,minspeed:4,callback:t},{pos:{x:30,y:200},g:1,mass:20,minspeed:1.8,callback:t},{pos:{x:330,y:100},g:1,mass:40,minspeed:1.8,callback:t}],c=[];c.push(new VectorAnimation({el:e,stageId:"stage",location:{x:100,y:100},gravityPoints:r,gravDistance:140,infinity:!0})),c.push(new VectorAnimation({stageId:"stage",location:{x:200,y:200},showGravityPointsColor:"#0f0",gravityPoints:[{pos:{x:100,y:100},g:1,callback:t}]})),c.push(new VectorAnimation({stageId:"stage",location:{x:100,y:100},showGravityPointsColor:"#00f",gravityPoints:[{pos:{x:400,y:100},g:1,callback:t}]})),c.forEach(function(t,e){t.showGravityPoints(),console.log(t.el),console.log(t.stageId),console.log(t.currentGPointNum)}),e.addEventListener("moveEnd",function(t){console.log("move end")}),requestAnimationFrame(function t(){for(var e=0;e<c.length;e++)if(0==e){c[e].arrive();var i=c[e].update().getPoint();o.left=i.x+"px",o.top=i.y+"px"}else 1==e?(c[e].seek(),i=c[e].update().getPoint(),s.left=i.x+"px",s.top=i.y+"px"):(c[e].arrive(),i=c[e].update().getPoint(),a.left=i.x+"px",a.top=i.y+"px");window.requestAnimationFrame(t)})}();//# sourceMappingURL=sample.js.map

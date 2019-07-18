import VectorAnimation from './modules/VectorAnimation.js';

(function() {
  var timer = {};
  var el  = document.querySelector('.thing');
  var el2 = document.querySelector('.thing2');
  var el3 = document.querySelector('.thing3');
  var elStyle = el.style;
  var el2Style = el2.style;
  var el3Style = el3.style;
  var callback = function(e) { console.log(e); }
  var gPoints = [
        { pos : { x: 300, y: 300 } , g : 1.0, mass : 10, minspeed : 4.0, callback : callback },
        { pos : { x: 30,  y: 200 } , g : 1.0, mass : 20, minspeed : 1.8, callback : callback },
        { pos : { x: 330, y: 100 } , g : 1.0, mass : 40, minspeed : 1.8, callback : callback }
      ];
  var things = [];

  things.push( new VectorAnimation(
    {
      el : el,
      stageId       : 'stage',
      location      : { x: 100, y: 100 },
      gravityPoints : gPoints,
      gravDistance  : 140,
      infinity      : true
    })
  );

  things.push( new VectorAnimation(
    {
      stageId                : 'stage',
      location               : { x: 200, y: 200 },
      showGravityPointsColor : '#0f0',
      gravityPoints : [
        { pos: { x: 100, y: 100 }, g: 1, callback: callback }
      ],
    })
  );

  things.push( new VectorAnimation(
    {
      stageId                : 'stage',
      location               : { x: 100, y: 100 },
      showGravityPointsColor : '#00f',
      gravityPoints          : [ { pos: { x: 400, y: 100 }, g: 1, callback: callback } ]
    })
  );

  things.forEach( (v, i) => {
    v.showGravityPoints();
    console.log(v.el)
    console.log(v.stageId)
    console.log(v.currentGPointNum)
  });

  el.addEventListener('moveEnd', function(e) {
    console.log('move end');
  });

  function loop() {
    for(var i = 0; i < things.length; i++) {
      if(i == 0) {
        things[i].arrive();
        var pos = things[i].update().getPoint();
        elStyle.left = pos.x + 'px';
        elStyle.top  = pos.y + 'px';
      }
      else if(i == 1) {
        things[i].seek();
        var pos = things[i].update().getPoint();
        el2Style.left = pos.x + 'px';
        el2Style.top  = pos.y + 'px';
      }
      else {
        things[i].arrive();
        var pos = things[i].update().getPoint();
        el3Style.left = pos.x + 'px';
        el3Style.top  = pos.y + 'px';
      }
    }

    window.requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);

})();

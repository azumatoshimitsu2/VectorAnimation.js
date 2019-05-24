# VectorAnimation.js

## 例:


    let vec = new VectorAnimation({
        location               : { x: 200, y: 200 },
        showGravityPointsColor : '#0f0',
        gravityPoints : [
          { pos: { x: 100, y: 100 }, g: 1, callback: callback }
        ],
    });

    vec.showGravityPoints();
    var pos = vec.update().getPoint();
    document.querySelector('.thing').style.left = pos.x + 'px';
    document.querySelector('.thing').style.top  = pos.y + 'px';


 
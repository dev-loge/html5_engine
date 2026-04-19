var input = {
    up: {
        pressed: false,
        axis: '-y'
    },
    down: {
        pressed: false,
        axis: '+y'
    },
    left: {
        pressed: false,
        axis: '-x'
    },
    right: {
        pressed: false,
        axis: '+x'
    }
}

document.addEventListener('keydown', function(event) {
    
    switch(event.key) {
        case 'w':
            input.up.pressed = true;
            break;
        case 'a':
            input.left.pressed = true;
            break;
        case 's':
            input.down.pressed= true;
            break;
        case 'd':
            input.right.pressed = true;
            break;
    }
});

document.addEventListener('keyup', function(event) {
    switch(event.key) {
        case 'w':
            input.up.pressed = false;
            break;
        case 'a':
            input.left.pressed = false;
            break;
        case 's':
            input.down.pressed = false;
            break;
        case 'd':
            input.right.pressed = false;
            break;
    }
});

var canvas = document.getElementById('game-canvas');
var ctx = canvas.getContext('2d');

var rectObject = {
    x: 50,
    y: 50,
    width: 50,
    height: 50,
    color: 'red',
    speed: 3,
    draw: function() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

var GameLoop = function() {
    //=======UPDATE STAGE========
        //handle input
        Object.keys(input).forEach(direction => {
            var key = input[direction];
            if(key.pressed) {
                if (key.axis[0] === '+')
                    rectObject[key.axis[1]] += rectObject.speed;
                else 
                    rectObject[key.axis[1]] -= rectObject.speed;
            }
        });
    //=======DRAW STAGE========
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        //keep the rectangle within the bounds of the canvas
        rectObject.x = Math.min(Math.max(rectObject.x, 0), canvas.width - rectObject.width);
        rectObject.y = Math.min(Math.max(rectObject.y, 0), canvas.height - rectObject.height);
        
        rectObject.draw();
}

setInterval(GameLoop, 1000/60);
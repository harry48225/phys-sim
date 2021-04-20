var ball = {
    x: 100,
    y: 100,
    vx: 0,
    vy: 1,
    radius: 25,
    color: 'red',
    draw: function() {
        let ctx = getCanvasContext();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2*Math.PI, true);
        ctx.closePath();
        ctx.fillStyle = this.colour;
        ctx.fill();
    },
    simulate: function() {
        this.x += this.vx
        this.y += this.vy
    }
}

function start() {
    draw()
}

function draw() {
    let ctx = getCanvasContext()

    // clear the rectangle
    ctx.clearRect(0, 0, getCanvas().width, getCanvas().height)


    drawEnvironment()
    ball.simulate()
    ball.draw()
    console.log("frame")

    window.requestAnimationFrame(draw)
}

function getCanvas() {
    return document.getElementById('canvas')
}

function getCanvasContext() {
    return getCanvas().getContext('2d')
}

function drawEnvironment() {
    // Draws the floor and any other parts of the environment

    let canvas = getCanvas()
    // draw a rectangle at the bottom of the screen

    let floorHeight = 5

    let ctx = getCanvasContext()
    ctx.fillRect(0, canvas.height - floorHeight, canvas.width, floorHeight)

}

function drawRect() {
    let ctx = getCanvasContext()
    ctx.fillStyle = 'rgb(200, 0, 0)'
    ctx.fillRect(10,10,50,50)
}

function drawCircle() {
    const ctx = getCanvasContext()

    ctx.beginPath()
    ctx.moveTo(75, 50)
    ctx.arc(50, 50, 30, 0, 2*Math.PI, true)
    ctx.fill()
}
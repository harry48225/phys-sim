


function PhysicsObject(x, y, vx, vy, mass, draw) {
    // a generic physics object,
    // draw should take an argument which is the 2D context to draw on
    // x, y, vx, vy, mass are in standard SI

    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.mass = mass;

    this.draw = draw;

    this.forces = [];
    
    this.resetForces = function () { this.forces = [] }

    this.addForce = function (force) { this.forces.push(force) }

    // applys the given forces to the object and updates the velocity
    this.applyForces = function () {}

}

function Ball(x, y, vx, vy, mass, radius, color) {

    PhysicsObject.call(this, x, y, vx, vy, mass, 
        (ctx) => {
            ctx.beginPath()
            ctx.arc(this.x, this.y, radius, 0, 2*Math.PI, true)
            ctx.closePath()
            ctx.fillStyle = this.color
            ctx.fill()
        })

}

//---------------------------------------------

var objects = []


function start() {
    // starts the simulation

    var ball = new Ball(10,10,0,0,1,5,'red')
    objects.push(ball)
    draw()
}

function draw() {
    let ctx = getCanvasContext()

    // clear the rectangle
    ctx.clearRect(0, 0, getCanvas().width, getCanvas().height)


    drawEnvironment()
    objects.forEach((physicsObject) => {
        physicsObject.draw(ctx)
    })
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
function Vector(x, y) {

    this.x = x
    this.y = y
    
    this.add = function (vector) { 
        this.x += vector.x
        this.y += vector.y
    }

    // returns euclidean length
    this.getLength = function () {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2))
    }

    this.normalise = function () {
        let length = this.getLength()

        this.x /= length
        this.y /= length

    }

    this.scale = function (scale) {
        this.x *= scale
        this.y *= scale
    }
}


function PhysicsObject(x, y, vx, vy, mass, grounded, draw) {
    // a generic physics object,
    // draw should take an argument which is the 2D context to draw on
    // x, y, vx, vy, mass are in standard SI

    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.mass = mass;

    this.draw = draw;

    
    this.grounded = grounded;

    // applys the given force to the object and updates the velocity
    this.applyForce = function (force) {
        // explicit euler for now

        let timeStep = 0.01

        // F = ma ==> a = F/m

        force.scale(1/this.mass)

        // v += a*t

        this.vx += (force.x) * timeStep
        this.vy += (force.y) * timeStep
        
        this.x += this.vx
        this.y += this.vy
    }

}

function Ball(x, y, vx, vy, mass, grounded, radius, color) {

    PhysicsObject.call(this, x, y, vx, vy, mass, grounded, 
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

    var ball = new Ball(10,10,0,0,1,false, 5,'red')
    objects.push(ball)
    loop()
}

function loop() {


    // ----- simulation -----

    objects
    .filter((physObj) => !physObj.grounded)
    .forEach((physObj) => {
        
        // apply gravity
        let force = new Vector(0,0)

        // might need a better coordinate system
        force.add(new Vector(0, 9.8*physObj.mass))
        
        physObj.applyForce(force)

    })

    // ----- drawing -----
    let ctx = getCanvasContext()

    // clear the rectangle
    ctx.clearRect(0, 0, getCanvas().width, getCanvas().height)


    drawEnvironment()

    objects.forEach((physObj) => {
        physObj.draw(ctx)
    })
    console.log("frame")

    window.requestAnimationFrame(loop)
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
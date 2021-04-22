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

class BoundingRectangle {
    // a rectangle with sides aligned to the axes to provide a rough area that the PhysicsObject should occupy
    // x, y, is the top left corner of the rectangle relative to the object, length is the x-direction, height is in the y-direction

    constructor(x, y, length, height) {
        this.x = x;
        this.y = y;
        this.length = length;
        this.height = height;
    }
    
    * yieldRelativePoints(stepSize) {
        for (let x_offset = this.x; x_offset < this.x + this.length; x_offset += stepSize) {
            for (let y_offset = this.y; y_offset < this.y + this.height; y_offset += stepSize) {
                yield {x:x_offset, y:y_offset}
            }
        }
    }

    draw (ctx, x, y) {

        let oldFillStyle = ctx.fillStyle
        ctx.fillStyle = "#FF0000"
        ctx.fillRect(x + this.x, y + this.y, this.length, this.height)
        ctx.fillStyle = oldFillStyle
    }
}


function PhysicsObject(x, y, vx, vy, mass, grounded, draw, isPointInside, boundingRectangle) {
    // a generic physics object,
    // draw should take an argument which is the 2D context to draw on
    // isPointInside should take x,y and return whether it's inside the shape
    // x, y, vx, vy, mass are in standard SI

    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.mass = mass;

    this.draw = draw;
    this.isPointInside = isPointInside;
    this.boundingRectangle = boundingRectangle;

    this.isObjectInside = function (otherObject) {
        let canvas = getCanvas()

        // divide the bounding rectangle into 1px by 1px squares
        // and check to see if there is a square that contains this object and the other object

        const SQUARE_SIZE = 1
        for (let relativePoint of this.boundingRectangle.yieldRelativePoints(SQUARE_SIZE)) {
            let point = {x: this.x + relativePoint.x, y: this.y + relativePoint.y}
            if (this.isPointInside(point.x,point.y) && otherObject.isPointInside(point.x,point.y)) {
                return true;
            }
        }
        return false;
    }
    
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
        function (ctx) {
            ctx.beginPath()
            ctx.arc(this.x, this.y, radius, 0, 2*Math.PI, true)
            ctx.closePath()
            ctx.fillStyle = this.color
            ctx.fill()
        },
        function (point_x,point_y) {
            // distance vector pointing from the ball to the point
            let distanceVector = new Vector(point_x - this.x, point_y - this.y)

            return (distanceVector.getLength() < radius)
        },
        // bounding rectangle uses relative coordinates
        new BoundingRectangle(-radius, -radius, 2*radius, 2*radius))

}

function Slab(x, y, vx, vy, mass, grounded, length, height) {
    // an slab of the given length and height starting from x,y (top left corner) extending in the positive x direction

    PhysicsObject.call(this, x, y, vx, vy, mass, grounded,
        function (ctx) {
            ctx.fillRect(x, y, length, height)
        },
        function (x,y) {
            return ((this.y < y) && (y < this.y + height) && (this.x < x) && (x < this.x + length))
        },
        new BoundingRectangle(0, 0, length, height))
}

//---------------------------------------------

var objects = []
var drawingBoundingRectangles = false

function toggleBoundingRectangles() {
    drawingBoundingRectangles = !drawingBoundingRectangles
}

function start() {
    // starts the simulation

    var ball = new Ball(10,10,0,0,1,false, 5,'red')
    objects.push(ball)

    var floor = new Slab(0, getCanvas().height - 5, 0, 0, 1, true, getCanvas().width, 5)
    objects.push(floor)
    loop()
}

function loop() {


    // ----- simulation -----

    objects
    .filter((physObj) => !physObj.grounded)
    .forEach((physObj) => {
        
       
        let force = new Vector(0,0)

        // apply gravity
        // might need a better coordinate system
        force.add(new Vector(0, 9.8*physObj.mass))

        // check for collisions

        objects.forEach((collidingPhysObj) => {

            if (collidingPhysObj !== physObj && physObj.isObjectInside(collidingPhysObj)) {
                console.log(collidingPhysObj)
                console.log(physObj)
                alert("pause")
            }
        })

        
        physObj.applyForce(force)

    })

    // ----- drawing -----
    let ctx = getCanvasContext()

    // clear the rectangle
    ctx.clearRect(0, 0, getCanvas().width, getCanvas().height)

    objects.forEach((physObj) => {
        physObj.draw(ctx)

        if (drawingBoundingRectangles) {
            physObj.boundingRectangle.draw(ctx, physObj.x, physObj.y)
        }
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
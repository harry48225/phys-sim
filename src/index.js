const TOLERANCE = 0.01
const TIME_STEP = 0.01

function Vector(x, y) {
    // all methods return a new vector
    this.x = x
    this.y = y
    
    this.add = function (vector) { 
        return new Vector(this.x + vector.x, this.y + vector.y)
    }

    this.subtract = function (vector) {

        return new Vector(this.x, this.y).add(vector.scale(-1))
    }

    // returns euclidean length
    this.getLength = function () {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2))
    }

    this.normalise = function () {
        let length = this.getLength()
        return new Vector(this.x / length, this.y / length)

    }

    this.scale = function (scale) {
        return new Vector(this.x * scale, this.y * scale)
    }

    // rotates the vector anticlockwise by the given angle in radians
    this.rotate = function (angle) {

        let new_x = this.x*Math.cos(angle) - this.y*Math.sin(angle)
        let new_y = this.x*Math.sin(angle) + this.y*Math.cos(angle)

        return new Vector(new_x, new_y)
    }

    // dot product
    this.dot = function (vector) {
        return this.x * vector.x + this.y * vector.y
    }
}

class BoundingRectangle {
    // a rectangle with sides aligned to the axes to provide a rough area that the PhysicsObject should occupy
    // x, y, is the center of the rectangle relative to the object, length is the x-direction, height is in the y-direction

    constructor(x_pos, y_pos, length, height) {
        this.x = x_pos;
        this.y = y_pos;
        this.length = length;
        this.height = height;
    }
    
    * yieldRelativePoints(stepSize) {
        for (let x_offset = this.x - this.length/2; x_offset < this.x + this.length/2; x_offset += stepSize) {
            for (let y_offset = this.y - this.height/2; y_offset < this.y + this.height/2; y_offset += stepSize) {
                yield {x:x_offset, y:y_offset}
            }
        }
    }

    draw (ctx, x, y) {

        let saved = startDrawing(ctx)
        let oldFillStyle = ctx.fillStyle
        ctx.fillStyle = "#FF0000"
        ctx.fillRect(x + this.x, y + this.y, this.length, this.height)
        ctx.fillStyle = oldFillStyle

        stopDrawing(ctx, saved)

    }
}


function PhysicsObject(x_pos, y_pos, vx, vy, mass, grounded, draw, isPointInside, 
    boundingRectangle, isPointOnPerimeter, closestPointTo,
    normalAtPoint, coefficientOfRestitution=1) {
    // a generic physics object,
    // draw should take an argument which is the 2D context to draw on
    // isPointInside should take x,y and return whether it's inside the shape
    // x, y, vx, vy, mass are in standard SI

    this.x = x_pos;
    this.y = y_pos;
    this.vx = vx;
    this.vy = vy;
    this.mass = mass;

    this.draw = draw;
    this.isPointInside = isPointInside;
    this.boundingRectangle = boundingRectangle;

    this.coefficientOfRestitution = coefficientOfRestitution

    this.isObjectInside = function (otherObject) {
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

        if (!this.grounded) {
            // explicit euler for now
            // F = ma ==> a = F/m

            force.scale(1/this.mass)

            // v += a*t

            this.vx += (force.x) * TIME_STEP
            this.vy += (force.y) * TIME_STEP
            
            this.x += this.vx
            this.y += this.vy
        }
    }

    // returns the point on the object which is closest to the point argument
    this.closestPointTo = closestPointTo

    this.isPointOnPerimeter = isPointOnPerimeter

    // return the normal to the surface at the given point
    this.normalAtPoint = normalAtPoint
}

function Ball(x_pos, y_pos, vx, vy, mass, grounded, radius, color) {

    this.radius = radius
    this.color = color

    PhysicsObject.call(this, x_pos, y_pos, vx, vy, mass, grounded, 
        function (ctx) {

            let saved = startDrawing(ctx)
            ctx.beginPath()
            ctx.arc(this.x, this.y, radius, 0, 2*Math.PI, true)
            ctx.closePath()
            ctx.fillStyle = this.color
            ctx.fill()

            stopDrawing(ctx, saved)
        },
        function (point_x,point_y) {
            // distance vector pointing from the ball to the point
            let distanceVector = new Vector(point_x - this.x, point_y - this.y)

            return (distanceVector.getLength() < radius)
        },
        // bounding rectangle uses relative coordinates
        new BoundingRectangle(-radius, -radius, 2*radius, 2*radius),
        )

}

function Slab(x_pos, y_pos, vx, vy, mass, grounded, length, height, angle=0, restitution=1) {
    // an slab of the given length and height with center x,y, with an angle <angle> (in radians) from the length to the positive x axis extending in the positive x direction

    this.length = length
    this.height = height
    this.angle = angle

    this.getLengthDirection = function () {
        return new Vector(Math.cos(angle), Math.sin(angle))
    }

    this.getHeightDirection = function () {
        return this.getLengthDirection().rotate(Math.PI/2) // rotate by pi/2 so that it points in the height direction
    }

    PhysicsObject.call(this, x_pos, y_pos, vx, vy, mass, grounded,
        // drawing command
        function (ctx) {

            // draw using a path
            let lengthDirection = this.getLengthDirection()
            
            let heightDirecton = this.getHeightDirection()
            
            let corner = new Vector(this.x, this.y).add(lengthDirection.scale(length/2)).add(heightDirecton.scale(height/2))
            
            let saved = startDrawing(ctx)
            ctx.beginPath();

            // first vertex
            ctx.moveTo(corner.x, corner.y)
            corner = corner.add(lengthDirection.scale(-length))
            ctx.lineTo(corner.x, corner.y)
            corner = corner.add(heightDirecton.scale(-height))
            ctx.lineTo(corner.x, corner.y)
            corner = corner.add(lengthDirection.scale(length))
            ctx.lineTo(corner.x, corner.y)
            ctx.fill()

            stopDrawing(ctx, saved)
        },
        // is point inside
        function (x,y) {

            let center_to_point = new Vector(x, y).subtract(new Vector(this.x, this.y))

            let distance_in_length_direction = Math.abs(center_to_point.dot(this.getLengthDirection()))
            let distance_in_height_direction = Math.abs(center_to_point.dot(this.getHeightDirection()))
            return (distance_in_length_direction <= length/2)
                && (distance_in_height_direction <= height/2)

        },
        new BoundingRectangle(0, 0, length, height),
        // is point on perimeter
        function (x,y) {

            let center_to_point = new Vector(x, y).subtract(new Vector(this.x, this.y))

            let distance_in_length_direction = Math.abs(center_to_point.dot(this.getLengthDirection()))
            let distance_in_height_direction = Math.abs(center_to_point.dot(this.getHeightDirection()))
            return ((length/2 - TOLERANCE <= distance_in_length_direction && distance_in_length_direction <= length/2 + TOLERANCE) 
            && distance_in_height_direction <= this.height/2)
            || ((height/2 - TOLERANCE <= distance_in_height_direction && distance_in_height_direction<= height/2 + TOLERANCE)
            && distance_in_length_direction <= this.length/2)
        },
        // closest point to
        function (x,y) {

            // do a raycast from the center to the point and find the first point of intersection
            let center_to_point = new Vector(x, y).subtract(new Vector(this.x, this.y))
            //let center_to_point_direction = center_to_point.normalise()

            let signed_distance_in_length = center_to_point.dot(this.getLengthDirection())
            let signed_distance_in_height = center_to_point.dot(this.getHeightDirection())

            let distance_in_length = Math.abs(signed_distance_in_length)
            let distance_in_height = Math.abs(signed_distance_in_height)

            // scale in the height direction to see if it's still on the rectangle
            let candidate_vector = new Vector(x,y).subtract(this.getHeightDirection().scale((distance_in_height - height/2)*(signed_distance_in_height/distance_in_height)))

            
            if (this.isPointOnPerimeter(candidate_vector.x, candidate_vector.y)) {
                return {x: candidate_vector.x, y: candidate_vector.y}
            }
            else {
                // it must be in the length direction
                candidate_vector = new Vector(x,y).subtract(this.getLengthDirection().scale((distance_in_length - length/2)*(signed_distance_in_length/distance_in_length)))

                return {x: candidate_vector.x, y: candidate_vector.y}
            }  
                     
        },
        // normal to surface at point
        function (x,y) {

            if (!this.isPointOnPerimeter(x,y)) {

                let closestPoint = this.closestPointTo(x,y)
                x = closestPoint.x
                y = closestPoint.y
            }

            let center_to_point = new Vector(x, y).subtract(new Vector(this.x, this.y))

            let signed_distance_in_length_direction = center_to_point.dot(this.getLengthDirection())
            let signed_distance_in_height_direction = center_to_point.dot(this.getHeightDirection())
            //let distance_in_length_direction = Math.abs(signed_distance_in_length_direction)
            let distance_in_height_direction = Math.abs(signed_distance_in_height_direction)

            let normal;
            if (height/2 - TOLERANCE <= distance_in_height_direction && distance_in_height_direction <= height/2 + TOLERANCE) {
                normal = this.getHeightDirection().scale(signed_distance_in_height_direction).normalise()
                //console.log("height normal")
            }
            else {
                normal = this.getLengthDirection().scale(signed_distance_in_length_direction).normalise()
            }

            return normal


        },
        restitution)
}

class CollisionHandler {

    static handleCollision (physObjectOne, physObjectTwo) {

        // probably don't actually need to do this since the get normal etc. methods
        // are general enough
        if (physObjectOne instanceof Slab || physObjectTwo instanceof Slab) {

            let slab = physObjectOne instanceof Slab ? physObjectOne : physObjectTwo
            let other = physObjectOne instanceof Slab ? physObjectTwo : physObjectOne

            if (other instanceof Ball) {
                CollisionHandler.handleBallSlabCollision(other, slab)
            }

        }
    }

    static handleBallSlabCollision (ball, slab) {
        let collision_point = slab.closestPointTo(ball.x, ball.y)

        let collision_normal = slab.normalAtPoint(collision_point.x, collision_point.y)

        //console.log(collision_normal)
        //console.log(collision_point)
        //console.log(collision_normal)

        // angle of incidence = angle of reflection
        // reflect the velocity in the normal

        let velocity = new Vector(ball.vx, ball.vy)
        let component_normal = collision_normal.scale(velocity.dot(collision_normal))

        velocity = velocity.subtract(component_normal.scale(2))

        // apply coefficient of restitution

        velocity = velocity.scale(slab.coefficientOfRestitution)

        // move so that we're outside the collision point
        
        ball.x -= ball.vx
        ball.y -= ball.vy
        

        let oldVelocity = new Vector(ball.vx, ball.vy)

        // apply the new velocity
        ball.vx = velocity.x
        ball.vy = velocity.y

        if (drawCollisionNormals) {
            let ctx = getCanvasContext()

            let saved = startDrawing(ctx)
            ctx.strokeStyle = 'red'
            ctx.lineWidth = 2
            ctx.beginPath()
            ctx.moveTo(collision_point.x, collision_point.y)

            ctx.lineTo(collision_point.x + 30*collision_normal.x, collision_point.y + 30*collision_normal.y)
            ctx.stroke()

            // old velocity
            ctx.strokeStyle = 'blue'
            ctx.beginPath()
            ctx.moveTo(collision_point.x, collision_point.y)
            ctx.lineTo(collision_point.x - 30*oldVelocity.x, collision_point.y - 30*oldVelocity.y)
            ctx.stroke()


            // new velocity
            ctx.strokeStyle = 'green'
            ctx.beginPath()
            ctx.moveTo(collision_point.x, collision_point.y)
            ctx.lineTo(collision_point.x + 30*ball.vx, collision_point.y + 30*ball.vy)
            ctx.stroke()

            stopDrawing(ctx, saved)

        }
        
    }
}

//---------------------------------------------

var objects = []
var drawingBoundingRectangles = false
var drawCollisionNormals = false
var mostRecentClick = null

function toggleBoundingRectangles() {
    drawingBoundingRectangles = !drawingBoundingRectangles
}

function toggleCollisionNormals() {
    drawCollisionNormals = !drawCollisionNormals
}

function getPhysicsCoordsFromClickEvent(event, canvas) {
    let rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left
    let y = rect.height -(event.clientY - rect.top) // convert from canvas coords to physics coords

    return {x: x, y: y}
}

function spawnBall(x, y, objectArray) {
    objectArray.push(new Ball(x, y, 0, 0, 1, false, 5, 'blue'))
}

function spawnSlabFromClickCoordinates(first_coordinate, second_coordinate, objectArray) {
    // expect coordinate to be a vector with x and y

    // reorder the coordinates to be in order of increasing x

    if (first_coordinate.x >= second_coordinate.x) {
        let temp = first_coordinate

        first_coordinate = second_coordinate
        second_coordinate = temp

    }

    // from the vector pointing from the first coordinate to the second

    let axisVector = new Vector(second_coordinate.x - first_coordinate.x, second_coordinate.y - first_coordinate.y)

    let length = axisVector.getLength()

    let vectorToCenter = axisVector.scale(0.5)
    
    let x = vectorToCenter.x + first_coordinate.x
    let y = vectorToCenter.y + first_coordinate.y

    // now find the angle

    let angle = Math.acos(vectorToCenter.normalise().dot(new Vector(1,0)))

    if (vectorToCenter.y < 0) {
        angle = Math.PI - angle
    }

    let slab = new Slab(x, y, 0, 0, 1, true, length, 5, angle)

    objectArray.push(slab)
}

function handleCanvasClick(event, canvas, objectArray) {
    
    let coords = getPhysicsCoordsFromClickEvent(event, canvas)

    if (document.getElementById('balls').checked) {
        spawnBall(coords.x, coords.y, objectArray)
    }

    if (document.getElementById('slabs').checked) {

        if (mostRecentClick != null) {
            spawnSlabFromClickCoordinates(coords, mostRecentClick, objectArray)

            mostRecentClick = null
        }

        else {
            mostRecentClick = coords
        }
        
    }

    else {
        mostRecentClick = null
    }
    // spawn a ball

    
}

function start() {

    getCanvas().addEventListener("mousedown", (event) => {handleCanvasClick(event, getCanvas(), objects)})
    // starts the simulation
    objects.push(new Ball(100,300,0,0,1,false, 5,'red'))

    objects.push(new Slab(getCanvas().width/2, 0, 0, 0, 1, true, getCanvas().width*2, 5, -Math.PI/4, 0.9))
    objects.push(new Slab(60, 50, 0, 0, 0, true, 1000, 2, Math.PI * 0.2))
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
        force = force.add(new Vector(0, -9.8*physObj.mass))

        // check for collisions

        objects.forEach((collidingPhysObj) => {

            if (collidingPhysObj !== physObj && physObj.isObjectInside(collidingPhysObj)) {
                //console.log(collidingPhysObj)
                //console.log(physObj)
                
                CollisionHandler.handleCollision(collidingPhysObj, physObj)

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
    //console.log("frame")

    window.requestAnimationFrame(loop)
}

function getCanvas() {
    return document.getElementById('canvas')
}

function startDrawing(ctx) {
    let saved = ctx.save()
    ctx.translate(0, getCanvas().height)
    ctx.scale(1,-1)

    return saved
}

function stopDrawing(ctx, savedState) {
    ctx.restore(savedState)
}

function getCanvasContext() {
    return getCanvas().getContext('2d')
}


module.exports = {

    // app
    start : start,
    toggleBoundingRectangles : toggleBoundingRectangles,
    toggleCollisionNormals : toggleCollisionNormals,
    // tests
    
    TIME_STEP : TIME_STEP,
    Vector : Vector,
    BoundingRectangle : BoundingRectangle,
    PhysicsObject : PhysicsObject,
    Ball : Ball,
    Slab : Slab,
    CollisionHandler : CollisionHandler,
    handleCanvasClick : handleCanvasClick,
    objects : objects,
    getPhysicsCoordsFromClickEvent : getPhysicsCoordsFromClickEvent,
    spawnBall : spawnBall,
    spawnSlabFromClickCoordinates : spawnSlabFromClickCoordinates,

}
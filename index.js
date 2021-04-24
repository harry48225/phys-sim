const TOLERANCE = 0.01

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


function PhysicsObject(x, y, vx, vy, mass, grounded, draw, isPointInside, 
    boundingRectangle, handleCollision, isPointOnPerimeter, closestPointTo,
    normalAtPoint) {
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

    this.handleCollision = handleCollision

    // returns the point on the object which is closest to the point argument
    this.closestPointTo = closestPointTo

    this.isPointOnPerimeter = isPointOnPerimeter

    // return the normal to the surface at the given point
    this.normalAtPoint = normalAtPoint
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
        new BoundingRectangle(-radius, -radius, 2*radius, 2*radius),
        // handle collision
        function (collisionObject) {

            if (collisionObject instanceof Slab)
            {
                let collision_point = collisionObject.closestPointTo(this.x, this.y)

                let collision_normal = collisionObject.normalAtPoint(collision_point.x, collision_point.y)

                console.log(collision_normal)
                console.log(collision_point)
                console.log(collision_normal)

                // angle of incidence = angle of reflection
                // reflect the velocity in the normal

                let velocity = new Vector(this.vx, this.vy)
                let component_normal = collision_normal.scale(velocity.dot(collision_normal))

                velocity = velocity.subtract(component_normal.scale(2))
                alert(velocity.dot(collision_normal))


                /*
                // move so that we're outside the collision point
                
                this.x -= this.vx
                this.y -= this.vy
                */

                let oldVelocity = new Vector(this.vx, this.vy)

                // apply the new velocity
                this.vx = velocity.x
                this.vy = velocity.y

                if (drawCollisionNormals) {
                    let ctx = getCanvasContext()
                    ctx.strokeStyle = 'red'
                    ctx.lineWidth = 2
                    ctx.beginPath()
                    ctx.moveTo(collision_point.x, collision_point.y)

                    ctx.lineTo(collision_point.x + 30*collision_normal.x, collision_point.y - 30*collision_normal.y)
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
                    ctx.lineTo(collision_point.x + 30*this.vx, collision_point.y + 30*this.vy)
                    ctx.stroke()

                }
                
                

                console.log(collision_point)
                console.log(collision_normal)
                alert()
                /*
                // also need to shift the object so that it's not clipping with the slab
                const COEFFICIENT_OF_RESTITUTION = 1 // should be a property of the slab
                this.vy = -this.vy*COEFFICIENT_OF_RESTITUTION
                */

                // handle non-grounded slab
            }
            
        })

}

function Slab(x, y, vx, vy, mass, grounded, length, height, angle=0) {
    // an slab of the given length and height with center x,y, with an angle <angle> (in radians) from the length to the positive x axis extending in the positive x direction

    this.getLengthDirection = function () {
        return new Vector(Math.cos(angle), Math.sin(angle))
    }

    this.getHeightDirection = function () {
        return this.getLengthDirection().rotate(Math.PI/2) // rotate by pi/2 so that it points in the height direction
    }

    PhysicsObject.call(this, x, y, vx, vy, mass, grounded,
        // drawing command
        function (ctx) {

            // draw using a path
            let lengthDirection = this.getLengthDirection()
            
            let heightDirecton = this.getHeightDirection()
            
            let corner = new Vector(this.x, this.y).add(lengthDirection.scale(length/2)).add(heightDirecton.scale(height/2))
            
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
        // handle collision
        function (collisionObject) {},
        // is point on perimeter
        function (x,y) {

            let center_to_point = new Vector(x, y).subtract(new Vector(this.x, this.y))

            let distance_in_length_direction = Math.abs(center_to_point.dot(this.getLengthDirection()))
            let distance_in_height_direction = Math.abs(center_to_point.dot(this.getHeightDirection()))
            return (length/2 - TOLERANCE <= distance_in_height_direction && distance_in_length_direction <= length/2 + TOLERANCE)
                || (height/2 - TOLERANCE <= distance_in_height_direction && distance_in_height_direction<= height/2 + TOLERANCE)
        },
        // closest point to
        function (x,y) {

            // do a raycast from the center to the point and find the first point of intersection
            let center_to_point = new Vector(x, y).subtract(new Vector(this.x, this.y))
            let center_to_point_direction = center_to_point.normalise()

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
            let distance_in_length_direction = Math.abs(signed_distance_in_length_direction)
            let distance_in_height_direction = Math.abs(signed_distance_in_height_direction)

            let normal;
            if (height/2 - TOLERANCE <= distance_in_height_direction && distance_in_height_direction <= height/2 + TOLERANCE) {
                normal = this.getHeightDirection().scale(signed_distance_in_height_direction).normalise()
                console.log("height normal")
            }
            else {
                normal = this.getLengthDirection().scale(signed_distance_in_length_direction).normalise()
            }

            normal.y = -normal.y // account for the non-standard y axis direction of the canvas

            return normal


        })
}

//---------------------------------------------

var objects = []
var drawingBoundingRectangles = false
var drawCollisionNormals = true

function toggleBoundingRectangles() {
    drawingBoundingRectangles = !drawingBoundingRectangles
}

function toggleCollisionNormals() {
    drawCollisionNormals = !drawCollisionNormals
}

function start() {
    // starts the simulation
    objects.push(new Ball(200,10,0,0,1,false, 5,'red'))

    objects.push(new Slab(getCanvas().width/2, 200, 0, 0, 1, true, getCanvas().width*2, 5, -Math.PI/4))
    objects.push(new Slab(10, 60, 0, 0, 0, true, 1000, 2, -Math.PI * 0.7))
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
        force = force.add(new Vector(0, 9.8*physObj.mass))

        // check for collisions

        objects.forEach((collidingPhysObj) => {

            if (collidingPhysObj !== physObj && physObj.isObjectInside(collidingPhysObj)) {
                console.log(collidingPhysObj)
                console.log(physObj)
                
                if (physObj instanceof Ball) {
                    physObj.handleCollision(collidingPhysObj)
                }
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

function startDrawing(ctx) {
    let saved = ctx.save()
    ctx.translate(0, getCanvas().height)
    ctx.scale(1,-1)

    return saved
}

function stopDrawing(ctx, savedState) {
    ctx.restore(saved)
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
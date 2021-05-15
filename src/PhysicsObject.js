const CONSTANTS = require("./constants")

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

            this.vx += (force.x) * CONSTANTS.TIME_STEP
            this.vy += (force.y) * CONSTANTS.TIME_STEP
            
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

module.exports = PhysicsObject
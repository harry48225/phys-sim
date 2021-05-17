const CONSTANTS = require("./constants")
const DrawingTools = require("./DrawingTools")
const PhysicsObject = require("./PhysicsObject")
const BoundingRectangle = require("./BoundingRectangle")
const Vector = require("./Vector")

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
            
            let saved = DrawingTools.startDrawing(ctx)
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

            DrawingTools.stopDrawing(ctx, saved)
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
            return ((length/2 - CONSTANTS.TOLERANCE <= distance_in_length_direction && distance_in_length_direction <= length/2 + CONSTANTS.TOLERANCE) 
            && distance_in_height_direction <= this.height/2)
            || ((height/2 - CONSTANTS.TOLERANCE <= distance_in_height_direction && distance_in_height_direction<= height/2 + CONSTANTS.TOLERANCE)
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
            if (height/2 - CONSTANTS.TOLERANCE <= distance_in_height_direction && distance_in_height_direction <= height/2 + CONSTANTS.TOLERANCE) {
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

module.exports = Slab
const DrawingTools = require("./DrawingTools")
const PhysicsObject = require("./PhysicsObject")
const BoundingRectangle = require("./BoundingRectangle")
const Vector = require("./Vector")

function Ball(x_pos, y_pos, vx, vy, mass, grounded, radius, color) {

    this.radius = radius
    this.color = color

    PhysicsObject.call(this, x_pos, y_pos, vx, vy, mass, grounded, 
        function (ctx) {

            let saved = DrawingTools.startDrawing(ctx)
            ctx.beginPath()
            ctx.arc(this.x, this.y, radius, 0, 2*Math.PI, true)
            ctx.closePath()
            ctx.fillStyle = this.color
            ctx.fill()

            DrawingTools.stopDrawing(ctx, saved)
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

module.exports = Ball
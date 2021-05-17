const DrawingTools = require("./DrawingTools")

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

        let saved = DrawingTools.startDrawing(ctx)
        let oldFillStyle = ctx.fillStyle
        ctx.fillStyle = "#FF0000"
        ctx.fillRect(x + this.x, y + this.y, this.length, this.height)
        ctx.fillStyle = oldFillStyle

        DrawingTools.stopDrawing(ctx, saved)

    }
}

module.exports = BoundingRectangle
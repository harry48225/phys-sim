const Slab = require("./Slab")
const Ball = require("./Ball")

const Vector = require("./Vector")
const DrawingTools = require("./DrawingTools")

function handleCollision (physObjectOne, physObjectTwo) {

    // probably don't actually need to do this since the get normal etc. methods
    // are general enough
    if (physObjectOne instanceof Slab || physObjectTwo instanceof Slab) {

        let slab = physObjectOne instanceof Slab ? physObjectOne : physObjectTwo
        let other = physObjectOne instanceof Slab ? physObjectTwo : physObjectOne

        if (other instanceof Ball) {
            handleBallSlabCollision(other, slab)
        }

    }
}

function handleBallSlabCollision (ball, slab) {
    let collision_point = slab.closestPointTo(ball.x, ball.y)

    let collision_normal = slab.normalAtPoint(collision_point.x, collision_point.y)

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

    /*
    if (drawCollisionNormals) {
        let ctx = DrawingTools.getCanvasContext()

        let saved = DrawingTools.startDrawing(ctx)
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

        DrawingTools.stopDrawing(ctx, saved)

    }
    */
    
}


module.exports = {
    handleCollision : handleCollision,
    handleBallSlabCollision : handleCollision,
}
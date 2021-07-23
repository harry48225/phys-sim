const CONSTANTS = require("./constants")
const DrawingTools = require("./DrawingTools")

const PhysicsObject = require("./PhysicsObject")
const Vector = require("./Vector")
const BoundingRectangle = require("./BoundingRectangle.js")
const Ball = require("./Ball")
const Slab = require("./Slab")
const CollisionHandler = require("./CollisionHandler")

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

    const canvas = DrawingTools.getCanvas();
    const canvasCard = document.getElementById("canvas-card");

    canvas.addEventListener("mousedown", (event) => {handleCanvasClick(event, DrawingTools.getCanvas(), objects)});
    canvas.setAttribute("width", canvasCard.clientWidth*CONSTANTS.CANVAS_SCALE_FACTOR);
    canvas.setAttribute("height", canvasCard.clientHeight*CONSTANTS.CANVAS_SCALE_FACTOR);

    // starts the simulation
    objects.push(new Ball(100,300,0,0,1,false, 5,'red'))

    objects.push(new Slab(DrawingTools.getCanvas().width/2, 0, 0, 0, 1, true, DrawingTools.getCanvas().width*2, 5, -Math.PI/4, 0.9))
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
                
                CollisionHandler.handleCollision(collidingPhysObj, physObj)

            }
        })

        
        physObj.applyForce(force)

    })

    // ----- drawing -----
    let ctx = DrawingTools.getCanvasContext()

    // clear the rectangle
    ctx.clearRect(0, 0, DrawingTools.getCanvas().width, DrawingTools.getCanvas().height)

    objects.forEach((physObj) => {
        physObj.draw(ctx)

        if (drawingBoundingRectangles) {
            physObj.boundingRectangle.draw(ctx, physObj.x, physObj.y)
        }
    })
    //console.log("frame")

    window.requestAnimationFrame(loop)
}

module.exports = {

    // app
    start : start,
    toggleBoundingRectangles : toggleBoundingRectangles,
    toggleCollisionNormals : toggleCollisionNormals,
    // tests
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

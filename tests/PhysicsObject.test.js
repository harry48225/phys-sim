const PhysicsObject = require("../src/PhysicsObject")
const Vector = require("../src/Vector")
const BoundingRectangle = require("../src/BoundingRectangle")
const CONSTANTS = require("../src/constants")

describe('PhysicsObject', () => {

    test('constructor without restitution', () => {

        let x = 1
        let y = 2
        let vx = 3
        let vy = 4
        let mass = 5
        let grounded = true
        let draw = () => {}
        let isPointInside = () => {}
        let boundingRectangle = null
        let isPointOnPerimeter = () => {}
        let closestPointTo = () => {}
        let normalAtPoint = () => {}

        let physObj = new PhysicsObject(x,y,vx,vy,mass,grounded, draw,
            isPointInside, boundingRectangle, isPointOnPerimeter,
            closestPointTo, normalAtPoint)

        expect(physObj.x).toBe(x)
        expect(physObj.y).toBe(y)
        expect(physObj.vx).toBe(vx)
        expect(physObj.vy).toBe(vy)
        expect(physObj.mass).toBe(mass)
        expect(physObj.grounded).toBe(grounded)
        expect(physObj.draw).toBe(draw)
        expect(physObj.isPointInside).toBe(isPointInside)
        expect(physObj.boundingRectangle).toBe(boundingRectangle)
        expect(physObj.isPointOnPerimeter).toBe(isPointOnPerimeter)
        expect(physObj.closestPointTo).toBe(closestPointTo)
        expect(physObj.normalAtPoint).toBe(normalAtPoint)
        expect(physObj.coefficientOfRestitution).toBe(1)
        
    })

    test('constructor with restitution', () => {

        let x = 1
        let y = 2
        let vx = 3
        let vy = 4
        let mass = 5
        let grounded = true
        let draw = () => {}
        let isPointInside = () => {}
        let boundingRectangle = null
        let isPointOnPerimeter = () => {}
        let closestPointTo = () => {}
        let normalAtPoint = () => {}
        let restitution = 0.5

        let physObj = new PhysicsObject(x,y,vx,vy,mass,grounded, draw,
            isPointInside, boundingRectangle, isPointOnPerimeter,
            closestPointTo, normalAtPoint, restitution)

        expect(physObj.x).toBe(x)
        expect(physObj.y).toBe(y)
        expect(physObj.vx).toBe(vx)
        expect(physObj.vy).toBe(vy)
        expect(physObj.mass).toBe(mass)
        expect(physObj.grounded).toBe(grounded)
        expect(physObj.draw).toBe(draw)
        expect(physObj.isPointInside).toBe(isPointInside)
        expect(physObj.boundingRectangle).toBe(boundingRectangle)
        expect(physObj.isPointOnPerimeter).toBe(isPointOnPerimeter)
        expect(physObj.closestPointTo).toBe(closestPointTo)
        expect(physObj.normalAtPoint).toBe(normalAtPoint)
        expect(physObj.coefficientOfRestitution).toBe(restitution)
        
    })

    test('is point inside basic test', () => {
        let x = 1
        let y = 2
        let vx = 3
        let vy = 4
        let mass = 5
        let grounded = true
        let draw = () => {}
        let isPointInside = (xx,yy) => {return xx == 1 && yy == 2}
        let boundingRectangle = new BoundingRectangle(1,2,5,5)
        let handleCollision = () => {}
        let isPointOnPerimeter = () => {}
        let closestPointTo = () => {}
        let normalAtPoint = () => {}

        let physObj = new PhysicsObject(x,y,vx,vy,mass,grounded, draw,
            isPointInside, boundingRectangle, handleCollision, isPointOnPerimeter,
            closestPointTo, normalAtPoint)
            
        expect(physObj.isPointInside(1,2)).toBeTruthy()
    })

    test('is point outside basic test', () => {
        let x = 1
        let y = 2
        let vx = 3
        let vy = 4
        let mass = 5
        let grounded = true
        let draw = () => {}
        let isPointInside = (xx,yy) => {return xx == 1 && yy == 2}
        let boundingRectangle = new BoundingRectangle(1,2,5,5)
        let handleCollision = () => {}
        let isPointOnPerimeter = () => {}
        let closestPointTo = () => {}
        let normalAtPoint = () => {}

        let physObj = new PhysicsObject(x,y,vx,vy,mass,grounded, draw,
            isPointInside, boundingRectangle, handleCollision, isPointOnPerimeter,
            closestPointTo, normalAtPoint)
            
        expect(physObj.isPointInside(10,-50)).toBeFalsy()
    })

    test('is object inside itself', () => {
        let x = 0
        let y = 0
        let vx = 3
        let vy = 4
        let mass = 5
        let grounded = true
        let draw = () => {}
        let isPointInside = (xx,yy) => {return xx == 0 && yy == 0}
        let boundingRectangle = new BoundingRectangle(0,0,2,2)
        let handleCollision = () => {}
        let isPointOnPerimeter = () => {}
        let closestPointTo = () => {}
        let normalAtPoint = () => {}

        let physObj = new PhysicsObject(x,y,vx,vy,mass,grounded, draw,
            isPointInside, boundingRectangle, handleCollision, isPointOnPerimeter,
            closestPointTo, normalAtPoint)

        expect(physObj.isObjectInside(physObj)).toBeTruthy()
    })

    test('non-grounded force application', () => {
        let x = 0
        let y = 0
        let vx = 0
        let vy = 0
        let mass = 1
        let grounded = false
        let draw = () => {}
        let isPointInside = () => {}
        let boundingRectangle = null
        let handleCollision = () => {}
        let isPointOnPerimeter = () => {}
        let closestPointTo = () => {}
        let normalAtPoint = () => {}

        let physObj = new PhysicsObject(x,y,vx,vy,mass,grounded, draw,
            isPointInside, boundingRectangle, handleCollision, isPointOnPerimeter,
            closestPointTo, normalAtPoint)

        physObj.applyForce(new Vector(10, 0))

        expect(physObj.vx).toBeCloseTo(10*CONSTANTS.TIME_STEP)
        expect(physObj.vy).toBeCloseTo(0*CONSTANTS.TIME_STEP)
    })

    test('grounded force application', () => {
        let x = 0
        let y = 0
        let vx = 0
        let vy = 0
        let mass = 1
        let grounded = true
        let draw = () => {}
        let isPointInside = () => {}
        let boundingRectangle = null
        let isPointOnPerimeter = () => {}
        let closestPointTo = () => {}
        let normalAtPoint = () => {}

        let physObj = new PhysicsObject(x,y,vx,vy,mass,grounded, draw,
            isPointInside, boundingRectangle, isPointOnPerimeter,
            closestPointTo, normalAtPoint)

        physObj.applyForce(new Vector(10, 0))

        expect(physObj.vx).toBeCloseTo(0)
        expect(physObj.vy).toBeCloseTo(0)
    })

    test('basic closest point to', () => {
        let x = 0
        let y = 0
        let vx = 0
        let vy = 0
        let mass = 1
        let grounded = true
        let draw = () => {}
        let isPointInside = () => {}
        let boundingRectangle = null
        let isPointOnPerimeter = () => {}
        let closestPointTo = (xx,yy) => {
            if (xx == 1 && yy == 0) {
                return {x:10, y:-10}
            }
            else {
                return {x:0, y:0}
            }
        }
        let normalAtPoint = () => {}

        let physObj = new PhysicsObject(x,y,vx,vy,mass,grounded, draw,
            isPointInside, boundingRectangle, isPointOnPerimeter,
            closestPointTo, normalAtPoint)

        expect(physObj.closestPointTo(1,0)).toEqual({x:10, y:-10})
        expect(physObj.closestPointTo(-100,100)).toEqual({x:0, y:0})
    })

    test('basic point is on perimeter', () => {
        let x = 0
        let y = 0
        let vx = 0
        let vy = 0
        let mass = 1
        let grounded = true
        let draw = () => {}
        let isPointInside = () => {}
        let boundingRectangle = null
        let isPointOnPerimeter = (xx,yy) => {return xx == 1 && yy == 1}
        let closestPointTo = () => {}
        let normalAtPoint = () => {}

        let physObj = new PhysicsObject(x,y,vx,vy,mass,grounded, draw,
            isPointInside, boundingRectangle, isPointOnPerimeter,
            closestPointTo, normalAtPoint)

        expect(physObj.isPointOnPerimeter(1,1)).toBeTruthy()
    })

    test('basic point is not on perimeter', () => {
        let x = 0
        let y = 0
        let vx = 0
        let vy = 0
        let mass = 1
        let grounded = true
        let draw = () => {}
        let isPointInside = () => {}
        let boundingRectangle = null
        let isPointOnPerimeter = (xx,yy) => {return xx == 1 && yy == 1}
        let closestPointTo = () => {}
        let normalAtPoint = () => {}

        let physObj = new PhysicsObject(x,y,vx,vy,mass,grounded, draw,
            isPointInside, boundingRectangle, isPointOnPerimeter,
            closestPointTo, normalAtPoint)

        expect(physObj.isPointOnPerimeter(-1,1)).toBeFalsy()
    })

    test('basic normal at point', () => {
        let x = 0
        let y = 0
        let vx = 0
        let vy = 0
        let mass = 1
        let grounded = true
        let draw = () => {}
        let isPointInside = () => {}
        let boundingRectangle = null
        let isPointOnPerimeter = () => {}
        let closestPointTo = () => {}
        let normalAtPoint = () => {return new Vector(1,0)}

        let physObj = new PhysicsObject(x,y,vx,vy,mass,grounded, draw,
            isPointInside, boundingRectangle, isPointOnPerimeter,
            closestPointTo, normalAtPoint)

        let normal = physObj.normalAtPoint()
        expect(normal.x).toBe(1)
        expect(normal.y).toBe(0)
    })

})

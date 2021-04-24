const index = require("./index")

describe("Vector", () => {
    test('length of (3,4) to equal 5', () => {
        expect(new index.Vector(3,4).getLength()).toBe(5)
    })

    test('adding two vectors', () => {
        let vector_a = new index.Vector(1,2)
        let vector_b = new index.Vector(-5,1)

        let result = vector_a.add(vector_b)

        expect({x:result.x, y:result.y}).toEqual({x:-4, y:3})
    })

    test('subtracting two vectors', () => {
        let vector_a = new index.Vector(1,2)
        let vector_b = new index.Vector(-5,1)

        let result = vector_a.subtract(vector_b)

        expect({x:result.x, y:result.y}).toEqual({x:6, y:1})
    })

    test('normalising vectors', () => {

        let vector = new index.Vector(3,4)
        vector = vector.normalise()

        expect(vector.x).toBe(3/5)
        expect(vector.y).toBe(4/5)
    })

    test('positively scaling vectors', () => {
        let vector = new index.Vector(1,4.5).scale(10)

        expect(vector.x).toBe(10)
        expect(vector.y).toBe(45)
    })

    test('negatively scaling vectors', () => {
        let vector = new index.Vector(4,15).scale(-3)

        expect(vector.x).toBe(-12)
        expect(vector.y).toBe(-45)
    })

    test('rotating vectors anticlockwise', () => {
        let vector = new index.Vector(1,0).rotate(Math.PI/2)

        expect(vector.x).toBeCloseTo(0)
        expect(vector.y).toBeCloseTo(1)
    })

    test('rotating vectors clockwise', () => {
        let vector = new index.Vector(1,0).rotate(-Math.PI/2)

        expect(vector.x).toBeCloseTo(0)
        expect(vector.y).toBeCloseTo(-1)
    })

    test('dot product', () => {
        let vector = new index.Vector(1,0)

        expect(vector.dot(new index.Vector(0,1))).toBe(0)
    })
})


describe('BoundingRectangle', () => {

    test('constructor test', () => {
        let rectangle = new index.BoundingRectangle(1, 2, 3, 4)

        expect(rectangle.x).toBe(1)
        expect(rectangle.y).toBe(2)
        expect(rectangle.length).toBe(3)
        expect(rectangle.height).toBe(4)
    })

    test('correct relative points yielded', () => {

        let length = 10
        let height = 100
        let rectangle = new index.BoundingRectangle(0,0,length,height)

        let step_size = 1

        let correct_points = []

        for (let x = -length/2; x < length/2; x += step_size) {
            for (let y = -height/2; y < height/2; y += step_size) {
                correct_points.push({x: x, y: y})
            }
        }

        let yielded_points = []

        for (let relativePoint of rectangle.yieldRelativePoints(step_size)) {
            yielded_points.push(relativePoint)
        }
        
        expect(yielded_points).toEqual(correct_points)
    })
})

describe('PhysicsObject', () => {

    test('constructor', () => {

        let x = 1
        let y = 2
        let vx = 3
        let vy = 4
        let mass = 5
        let grounded = true
        let draw = () => {}
        let isPointInside = () => {}
        let boundingRectangle = null
        let handleCollision = () => {}
        let isPointOnPerimeter = () => {}
        let closestPointTo = () => {}
        let normalAtPoint = () => {}

        let physObj = new index.PhysicsObject(x,y,vx,vy,mass,grounded, draw,
            isPointInside, boundingRectangle, handleCollision, isPointOnPerimeter,
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
        expect(physObj.handleCollision).toBe(handleCollision)
        expect(physObj.isPointOnPerimeter).toBe(isPointOnPerimeter)
        expect(physObj.closestPointTo).toBe(closestPointTo)
        expect(physObj.normalAtPoint).toBe(normalAtPoint)
        
    })

    test('is point inside basic test', () => {
        let x = 1
        let y = 2
        let vx = 3
        let vy = 4
        let mass = 5
        let grounded = true
        let draw = () => {}
        let isPointInside = (x,y) => {return x == 1 && y == 2}
        let boundingRectangle = new index.BoundingRectangle(1,2,5,5)
        let handleCollision = () => {}
        let isPointOnPerimeter = () => {}
        let closestPointTo = () => {}
        let normalAtPoint = () => {}

        let physObj = new index.PhysicsObject(x,y,vx,vy,mass,grounded, draw,
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
        let isPointInside = (x,y) => {return x == 1 && y == 2}
        let boundingRectangle = new index.BoundingRectangle(1,2,5,5)
        let handleCollision = () => {}
        let isPointOnPerimeter = () => {}
        let closestPointTo = () => {}
        let normalAtPoint = () => {}

        let physObj = new index.PhysicsObject(x,y,vx,vy,mass,grounded, draw,
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
        let isPointInside = (x,y) => {return x == 0 && y == 0}
        let boundingRectangle = new index.BoundingRectangle(0,0,2,2)
        let handleCollision = () => {}
        let isPointOnPerimeter = () => {}
        let closestPointTo = () => {}
        let normalAtPoint = () => {}

        let physObj = new index.PhysicsObject(x,y,vx,vy,mass,grounded, draw,
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

        let physObj = new index.PhysicsObject(x,y,vx,vy,mass,grounded, draw,
            isPointInside, boundingRectangle, handleCollision, isPointOnPerimeter,
            closestPointTo, normalAtPoint)

        physObj.applyForce(new index.Vector(10, 0))

        expect(physObj.vx).toBeCloseTo(10*index.TIME_STEP)
        expect(physObj.vy).toBeCloseTo(0*index.TIME_STEP)
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
        let handleCollision = () => {}
        let isPointOnPerimeter = () => {}
        let closestPointTo = () => {}
        let normalAtPoint = () => {}

        let physObj = new index.PhysicsObject(x,y,vx,vy,mass,grounded, draw,
            isPointInside, boundingRectangle, handleCollision, isPointOnPerimeter,
            closestPointTo, normalAtPoint)

        physObj.applyForce(new index.Vector(10, 0))

        expect(physObj.vx).toBeCloseTo(0)
        expect(physObj.vy).toBeCloseTo(0)
    })

    test('basic collision handling', () => {
        let x = 0
        let y = 0
        let vx = 0
        let vy = 0
        let mass = 1
        let grounded = true
        let draw = () => {}
        let isPointInside = () => {}
        let boundingRectangle = null
        let handleCollision = function () {this.x = 10; this.y = -10}
        let isPointOnPerimeter = () => {}
        let closestPointTo = () => {}
        let normalAtPoint = () => {}

        let physObj = new index.PhysicsObject(x,y,vx,vy,mass,grounded, draw,
            isPointInside, boundingRectangle, handleCollision, isPointOnPerimeter,
            closestPointTo, normalAtPoint)

        physObj.handleCollision()

        expect(physObj.x).toBe(10)
        expect(physObj.y).toBe(-10)
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
        let handleCollision = () => {}
        let isPointOnPerimeter = () => {}
        let closestPointTo = (x,y) => {
            if (x == 1 && y == 0) {
                return {x:10, y:-10}
            }
            else {
                return {x:0, y:0}
            }
        }
        let normalAtPoint = () => {}

        let physObj = new index.PhysicsObject(x,y,vx,vy,mass,grounded, draw,
            isPointInside, boundingRectangle, handleCollision, isPointOnPerimeter,
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
        let handleCollision = () => {}
        let isPointOnPerimeter = (x,y) => {return x == 1 && y == 1}
        let closestPointTo = () => {}
        let normalAtPoint = () => {}

        let physObj = new index.PhysicsObject(x,y,vx,vy,mass,grounded, draw,
            isPointInside, boundingRectangle, handleCollision, isPointOnPerimeter,
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
        let handleCollision = () => {}
        let isPointOnPerimeter = (x,y) => {return x == 1 && y == 1}
        let closestPointTo = () => {}
        let normalAtPoint = () => {}

        let physObj = new index.PhysicsObject(x,y,vx,vy,mass,grounded, draw,
            isPointInside, boundingRectangle, handleCollision, isPointOnPerimeter,
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
        let handleCollision = () => {}
        let isPointOnPerimeter = () => {}
        let closestPointTo = () => {}
        let normalAtPoint = () => {return new index.Vector(1,0)}

        let physObj = new index.PhysicsObject(x,y,vx,vy,mass,grounded, draw,
            isPointInside, boundingRectangle, handleCollision, isPointOnPerimeter,
            closestPointTo, normalAtPoint)

        let normal = physObj.normalAtPoint()
        expect(normal.x).toBe(1)
        expect(normal.y).toBe(0)
    })

})

describe('Ball', () => {

    test('constructor', () => {
        let x = 1
        let y = 2
        let vx = 3
        let vy = 4
        let mass = 5
        let grounded = false
        let radius = 6
        let color = 'green'

        let ball = new index.Ball(x,y,vx,vy,mass,grounded,radius,color)

        expect(ball.x).toBe(x)
        expect(ball.y).toBe(y)
        expect(ball.vx).toBe(vx)
        expect(ball.vy).toBe(vy)
        expect(ball.mass).toBe(mass)
        expect(ball.grounded).toBe(grounded)
        expect(ball.radius).toBe(radius)
        expect(ball.color).toBe(color)
        
    })

    test('is point inside', () => {

        let x = 0
        let y = 0
        let vx = 3
        let vy = 4
        let mass = 5
        let grounded = false
        let radius = 6
        let color = 'green'

        let ball = new index.Ball(x,y,vx,vy,mass,grounded,radius,color)

        expect(ball.isPointInside(0,0)).toBeTruthy()
        expect(ball.isPointInside(0,3)).toBeTruthy()

    })

    test('is point outside', () => {
        let x = 0
        let y = 0
        let vx = 3
        let vy = 4
        let mass = 5
        let grounded = false
        let radius = 6
        let color = 'green'

        let ball = new index.Ball(x,y,vx,vy,mass,grounded,radius,color)

        expect(ball.isPointInside(100,100)).toBeFalsy()
    })

})

describe('Slab', () => {
    
    test('constructor', () => {

        let x = 0;
        let y = 1;
        let vx = 2;
        let vy = 3;
        let mass = 4;
        let grounded = true;
        let length = 5;
        let height = 6;
        let angle = Math.PI;

        let slab = new index.Slab(x,y,vx,vy,mass,grounded,length,height,angle)
        
        expect(slab.x).toBe(x)
        expect(slab.y).toBe(y)
        expect(slab.vx).toBe(vx)
        expect(slab.vy).toBe(vy)
        expect(slab.mass).toBe(mass)
        expect(slab.grounded).toBe(grounded)
        expect(slab.length).toBe(length)
        expect(slab.height).toBe(height)
        expect(slab.angle).toBe(angle)
    })

    test('correct length direction', () => {
        let x = 0;
        let y = 1;
        let vx = 2;
        let vy = 3;
        let mass = 4;
        let grounded = true;
        let length = 5;
        let height = 6;
        let angle = Math.PI/4;

        let slab = new index.Slab(x,y,vx,vy,mass,grounded,length,height,angle)
        
        let lengthDirection = slab.getLengthDirection()
        
        expect(lengthDirection.x).toBeCloseTo(1/Math.sqrt(2))
        expect(lengthDirection.y).toBeCloseTo(1/Math.sqrt(2))
    })

    test('correct height direction', () => {
        let x = 0;
        let y = 1;
        let vx = 2;
        let vy = 3;
        let mass = 4;
        let grounded = true;
        let length = 5;
        let height = 6;
        let angle = Math.PI/4;

        let slab = new index.Slab(x,y,vx,vy,mass,grounded,length,height,angle)
        
        let heightDirection = slab.getHeightDirection()
        
        expect(heightDirection.x).toBeCloseTo(-1/Math.sqrt(2))
        expect(heightDirection.y).toBeCloseTo(1/Math.sqrt(2))
    })

    test('is point inside', () => {
        let x = 0;
        let y = 1;
        let vx = 2;
        let vy = 3;
        let mass = 4;
        let grounded = true;
        let length = 5;
        let height = 6;
        let angle = Math.PI/4;

        let slab = new index.Slab(x,y,vx,vy,mass,grounded,length,height,angle)

        expect(slab.isPointInside(0,2)).toBeTruthy()
    })

    test('is point outside', () => {
        let x = 0;
        let y = 1;
        let vx = 2;
        let vy = 3;
        let mass = 4;
        let grounded = true;
        let length = 5;
        let height = 6;
        let angle = Math.PI/4;

        let slab = new index.Slab(x,y,vx,vy,mass,grounded,length,height,angle)

        expect(slab.isPointInside(0,200)).toBeFalsy()
    })

    test('is point on perimeter', () => {
        let x = 0;
        let y = 1;
        let vx = 2;
        let vy = 3;
        let mass = 4;
        let grounded = true;
        let length = 5;
        let height = 6;
        let angle = 0;

        let slab = new index.Slab(x,y,vx,vy,mass,grounded,length,height,angle)

        expect(slab.isPointOnPerimeter(2.5, 4)).toBeTruthy()
    })

    test('point inside is not on perimeter', () => {
        let x = 0;
        let y = 1;
        let vx = 2;
        let vy = 3;
        let mass = 4;
        let grounded = true;
        let length = 5;
        let height = 6;
        let angle = 0;

        let slab = new index.Slab(x,y,vx,vy,mass,grounded,length,height,angle)

        expect(slab.isPointOnPerimeter(0, 1)).toBeFalsy()
    })

    test('point outside is not on perimeter', () => {
        let x = 0;
        let y = 1;
        let vx = 2;
        let vy = 3;
        let mass = 4;
        let grounded = true;
        let length = 5;
        let height = 6;
        let angle = 0;

        let slab = new index.Slab(x,y,vx,vy,mass,grounded,length,height,angle)

        expect(slab.isPointOnPerimeter(0, 1000)).toBeFalsy()
    })

    test('closest point to in height direction', () => {
        let x = 0;
        let y = 1;
        let vx = 2;
        let vy = 3;
        let mass = 4;
        let grounded = true;
        let length = 5;
        let height = 6;
        let angle = 0;

        let slab = new index.Slab(x,y,vx,vy,mass,grounded,length,height,angle)

        let point = slab.closestPointTo(0, 5)

        expect(point.x).toBeCloseTo(0)
        expect(point.y).toBeCloseTo(4)
    })

    test('closest point to in length direction', () => {
        let x = 0;
        let y = 1;
        let vx = 2;
        let vy = 3;
        let mass = 4;
        let grounded = true;
        let length = 5;
        let height = 6;
        let angle = 0;

        let slab = new index.Slab(x,y,vx,vy,mass,grounded,length,height,angle)

        let point = slab.closestPointTo(-10, 1)

        expect(point.x).toBeCloseTo(-2.5)
        expect(point.y).toBeCloseTo(1)
    })

    test('normal to point on perimeter in length direction', () => {
        let x = 0;
        let y = 1;
        let vx = 2;
        let vy = 3;
        let mass = 4;
        let grounded = true;
        let length = 5;
        let height = 6;
        let angle = 0;

        let slab = new index.Slab(x,y,vx,vy,mass,grounded,length,height,angle)

        let point = slab.normalAtPoint(-2.5, 1)

        expect(point.x).toBeCloseTo(-1)
        expect(point.y).toBeCloseTo(0)
    })

    test('normal to point not on perimeter in length direction', () => {
        let x = 0;
        let y = 1;
        let vx = 2;
        let vy = 3;
        let mass = 4;
        let grounded = true;
        let length = 5;
        let height = 6;
        let angle = 0;

        let slab = new index.Slab(x,y,vx,vy,mass,grounded,length,height,angle)

        let point = slab.normalAtPoint(-25, 1)

        expect(point.x).toBeCloseTo(-1)
        expect(point.y).toBeCloseTo(0)
    })

    test('normal to point on perimeter in height direction', () => {
        let x = 0;
        let y = 1;
        let vx = 2;
        let vy = 3;
        let mass = 4;
        let grounded = true;
        let length = 5;
        let height = 6;
        let angle = 0;

        let slab = new index.Slab(x,y,vx,vy,mass,grounded,length,height,angle)

        let point = slab.normalAtPoint(0, 4)

        expect(point.x).toBeCloseTo(0)
        expect(point.y).toBeCloseTo(1)
    })

    test('normal to point not on perimeter in height direction', () => {
        let x = 0;
        let y = 1;
        let vx = 2;
        let vy = 3;
        let mass = 4;
        let grounded = true;
        let length = 5;
        let height = 6;
        let angle = 0;

        let slab = new index.Slab(x,y,vx,vy,mass,grounded,length,height,angle)

        let point = slab.normalAtPoint(0, 5)

        expect(point.x).toBeCloseTo(0)
        expect(point.y).toBeCloseTo(1)
    })
    
})
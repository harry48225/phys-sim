const Slab = require("../src/Slab")

describe('Slab', () => {
    
    test('constructor without restitution', () => {

        let x = 0;
        let y = 1;
        let vx = 2;
        let vy = 3;
        let mass = 4;
        let grounded = true;
        let length = 5;
        let height = 6;
        let angle = Math.PI;

        let slab = new Slab(x,y,vx,vy,mass,grounded,length,height,angle)
        
        expect(slab.x).toBe(x)
        expect(slab.y).toBe(y)
        expect(slab.vx).toBe(vx)
        expect(slab.vy).toBe(vy)
        expect(slab.mass).toBe(mass)
        expect(slab.grounded).toBe(grounded)
        expect(slab.length).toBe(length)
        expect(slab.height).toBe(height)
        expect(slab.angle).toBe(angle)
        expect(slab.coefficientOfRestitution).toBe(1)
    })

    test('constructor with restitution', () => {

        let x = 0;
        let y = 1;
        let vx = 2;
        let vy = 3;
        let mass = 4;
        let grounded = true;
        let length = 5;
        let height = 6;
        let angle = Math.PI;
        let restitution = 0.1

        let slab = new Slab(x,y,vx,vy,mass,grounded,length,height,angle, restitution)
        
        expect(slab.x).toBe(x)
        expect(slab.y).toBe(y)
        expect(slab.vx).toBe(vx)
        expect(slab.vy).toBe(vy)
        expect(slab.mass).toBe(mass)
        expect(slab.grounded).toBe(grounded)
        expect(slab.length).toBe(length)
        expect(slab.height).toBe(height)
        expect(slab.angle).toBe(angle)
        expect(slab.coefficientOfRestitution).toBe(restitution)
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

        let slab = new Slab(x,y,vx,vy,mass,grounded,length,height,angle)
        
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

        let slab = new Slab(x,y,vx,vy,mass,grounded,length,height,angle)
        
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

        let slab = new Slab(x,y,vx,vy,mass,grounded,length,height,angle)

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

        let slab = new Slab(x,y,vx,vy,mass,grounded,length,height,angle)

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

        let slab = new Slab(x,y,vx,vy,mass,grounded,length,height,angle)

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

        let slab = new Slab(x,y,vx,vy,mass,grounded,length,height,angle)

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

        let slab = new Slab(x,y,vx,vy,mass,grounded,length,height,angle)

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

        let slab = new Slab(x,y,vx,vy,mass,grounded,length,height,angle)

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

        let slab = new Slab(x,y,vx,vy,mass,grounded,length,height,angle)

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

        let slab = new Slab(x,y,vx,vy,mass,grounded,length,height,angle)

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

        let slab = new Slab(x,y,vx,vy,mass,grounded,length,height,angle)

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

        let slab = new Slab(x,y,vx,vy,mass,grounded,length,height,angle)

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

        let slab = new Slab(x,y,vx,vy,mass,grounded,length,height,angle)

        let point = slab.normalAtPoint(0, 5)

        expect(point.x).toBeCloseTo(0)
        expect(point.y).toBeCloseTo(1)
    })
    
})
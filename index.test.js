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
const BoundingRectangle = require("../src/BoundingRectangle")

describe('BoundingRectangle', () => {

    test('constructor test', () => {
        let rectangle = new BoundingRectangle(1, 2, 3, 4)

        expect(rectangle.x).toBe(1)
        expect(rectangle.y).toBe(2)
        expect(rectangle.length).toBe(3)
        expect(rectangle.height).toBe(4)
    })

    test('correct relative points yielded', () => {

        let length = 10
        let height = 100
        let rectangle = new BoundingRectangle(0,0,length,height)

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

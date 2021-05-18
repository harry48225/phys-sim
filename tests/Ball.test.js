const Ball = require("../src/Ball")

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

        let ball = new Ball(x,y,vx,vy,mass,grounded,radius,color)

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

        let ball = new Ball(x,y,vx,vy,mass,grounded,radius,color)

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

        let ball = new Ball(x,y,vx,vy,mass,grounded,radius,color)

        expect(ball.isPointInside(100,100)).toBeFalsy()
    })

})

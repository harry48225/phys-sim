const CollisionHandler = require("../src/CollisionHandler")
const Vector = require("../src/Vector")
const Slab = require("../src/Slab")
const Ball = require("../src/Ball")

describe('CollisionHandler', () => {
    describe('Ball and grounded Slab', () => {

        describe('vertical ball onto horizontal slab', () => {
            let ball
            let slab
            beforeEach(() => {

                // make the ball
                let ball_x = 0
                let ball_y = 5.5
                let ball_vx = 0
                let ball_vy = -5
                let ball_mass = 5
                let ball_grounded = false
                let ball_radius = 5
                let ball_color = 'green'
    
                ball = new Ball(ball_x,ball_y,ball_vx,ball_vy,ball_mass,ball_grounded,ball_radius,ball_color)
    
                // make the slab
                let slab_x = 0;
                let slab_y = 0;
                let slab_vx = 0;
                let slab_vy = 0;
                let slab_mass = 1;
                let slab_grounded = true;
                let slab_length = 5;
                let slab_height = 2;
                let slab_angle = Math.PI;
                let slab_restitution = 1
    
                slab = new Slab(slab_x,slab_y,slab_vx,slab_vy,slab_mass,slab_grounded,slab_length,slab_height,slab_angle, slab_restitution)
                
    
            })
    
            test('correct ball speed', () => {

                CollisionHandler.handleCollision(ball, slab)

                let velocity = new Vector(ball.vx, ball.vy)
                expect(velocity.getLength()).toBeCloseTo(5)

            })

            test('correct slab speed', () => {

                CollisionHandler.handleCollision(ball, slab)

                let velocity = new Vector(slab.vx, slab.vy)
                expect(velocity.getLength()).toBeCloseTo(0)

            })

            test('correct ball velocity', () => {
                CollisionHandler.handleCollision(ball, slab)
                expect(ball.vy).toBeCloseTo(5)
                expect(ball.vx).toBeCloseTo(0)
            })
        })

        describe('vertical ball onto angled slab', () => {
            let ball
            let slab
            beforeEach(() => {

                // make the ball
                let ball_x = 0
                let ball_y = 0.5
                let ball_vx = 0
                let ball_vy = -5
                let ball_mass = 5
                let ball_grounded = false
                let ball_radius = 5
                let ball_color = 'green'
    
                ball = new Ball(ball_x,ball_y,ball_vx,ball_vy,ball_mass,ball_grounded,ball_radius,ball_color)
    
                // make the slab
                let slab_x = 0;
                let slab_y = 0;
                let slab_vx = 0;
                let slab_vy = 0;
                let slab_mass = 1;
                let slab_grounded = true;
                let slab_length = 5;
                let slab_height = 2;
                let slab_angle = Math.PI/4;
                let slab_restitution = 1
    
                slab = new Slab(slab_x,slab_y,slab_vx,slab_vy,slab_mass,slab_grounded,slab_length,slab_height,slab_angle, slab_restitution)
                
    
            })
    
            test('correct ball speed', () => {

                CollisionHandler.handleCollision(ball, slab)

                let velocity = new Vector(ball.vx, ball.vy)
                expect(velocity.getLength()).toBeCloseTo(5)

            })

            test('correct slab speed', () => {

                CollisionHandler.handleCollision(ball, slab)

                let velocity = new Vector(slab.vx, slab.vy)
                expect(velocity.getLength()).toBeCloseTo(0)

            })

            test('correct ball velocity', () => {
                CollisionHandler.handleCollision(ball, slab)
                expect(ball.vy).toBeCloseTo(0)
                expect(ball.vx).toBeCloseTo(-5)
            })
        })
    })
})

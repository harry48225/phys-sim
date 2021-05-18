const index = require("../src/index")
const CONSTANTS = require("../src/constants")

describe('user interface', () => {

    test('correct click location', () => {
        // mock a canvas object

        let mockCanvas = {
            getBoundingClientRect : jest.fn(() => {
                return {left: 0, right: 0, height: 0, top: 0}
            })
        }

        // mock event object
        let mockEvent = {clientX: 10, clientY: 20}

        let coords = index.getPhysicsCoordsFromClickEvent(mockEvent, mockCanvas)

        expect(coords.x).toBeCloseTo(10)
        expect(coords.y).toBeCloseTo(-20)
    })

    describe('adding balls', () => {

        let mockObjects;

        beforeEach(() => {
            mockObjects = []

            index.spawnBall(10, -20, mockObjects)

        })

        test('one object in the array (the new ball)', () => {
            expect(mockObjects).toHaveLength(1)

        })

        test('the object added was a ball', () => {
            let potentialBall = mockObjects[0]
            expect(potentialBall instanceof index.Ball).toBeTruthy()
        })

        test('ball added at correct location', () => {
            let ball = mockObjects[0]

            expect(ball.x).toBeCloseTo(10)
            expect(ball.y).toBeCloseTo(-20)
        })

        test('ball has zero velocity', () => {
            let ball = mockObjects[0]

            expect(ball.vx).toBeCloseTo(0)
            expect(ball.vy).toBeCloseTo(0)
        })
    })

    describe('adding slabs', () => {

        describe('simple horizontal slab', () => {
            let mockObjects;

            beforeEach(() => {
                mockObjects = []

                index.spawnSlabFromClickCoordinates({x: -10, y: 0}, {x:10, y:0}, mockObjects)

            })

            test('one object in the array', () => {
                expect(mockObjects).toHaveLength(1)

            })

            test('the object added was a slab', () => {
                let potentialBall = mockObjects[0]
                expect(potentialBall instanceof index.Slab).toBeTruthy()
            })

            test('slab has correct center', () => {
                let slab = mockObjects[0]

                expect(slab.x).toBeCloseTo(0)
                expect(slab.y).toBeCloseTo(0)
            })
            
            test('slab has correct angle', () => {
                let slab = mockObjects[0]

                expect(slab.angle).toBeCloseTo(0)
            })

            test('slab has zero velocity', () => {
                let slab = mockObjects[0]

                expect(slab.vx).toBeCloseTo(0)
                expect(slab.vy).toBeCloseTo(0)
            })
        })

        describe('vertical slab', () => {
            let mockObjects;
    
            beforeEach(() => {
                mockObjects = []
    
                index.spawnSlabFromClickCoordinates({x: 0, y: 10}, {x:0, y:-10}, mockObjects)
    
            })
    
            test('one object in the array', () => {
                expect(mockObjects).toHaveLength(1)
    
            })
    
            test('the object added was a slab', () => {
                let potentialBall = mockObjects[0]
                expect(potentialBall instanceof index.Slab).toBeTruthy()
            })
    
            test('slab has correct center', () => {
                let slab = mockObjects[0]
    
                expect(slab.x).toBeCloseTo(0)
                expect(slab.y).toBeCloseTo(0)
            })
    
            test('slab has correct angle', () => {
                let slab = mockObjects[0]
    
                expect(slab.angle).toBeCloseTo(Math.PI/2)
            })
    
            test('slab has zero velocity', () => {
                let slab = mockObjects[0]
    
                expect(slab.vx).toBeCloseTo(0)
                expect(slab.vy).toBeCloseTo(0)
            })
        })

        describe('acute angled slab', () => {
            let mockObjects;

            beforeEach(() => {
                mockObjects = []

                index.spawnSlabFromClickCoordinates({x: -10, y: -10}, {x:10, y:10}, mockObjects)

            })

            test('one object in the array', () => {
                expect(mockObjects).toHaveLength(1)

            })

            test('the object added was a slab', () => {
                let potentialBall = mockObjects[0]
                expect(potentialBall instanceof index.Slab).toBeTruthy()
            })

            test('slab has correct center', () => {
                let slab = mockObjects[0]

                expect(slab.x).toBeCloseTo(0)
                expect(slab.y).toBeCloseTo(0)
            })

            test('slab has correct angle', () => {
                let slab = mockObjects[0]

                expect(slab.angle).toBeCloseTo(Math.PI/4)
            })

            test('slab has zero velocity', () => {
                let slab = mockObjects[0]

                expect(slab.vx).toBeCloseTo(0)
                expect(slab.vy).toBeCloseTo(0)
            })
        })
        
        describe('obtuse angled slab', () => {
            let mockObjects;
    
            beforeEach(() => {
                mockObjects = []
    
                index.spawnSlabFromClickCoordinates({x: -10, y: 10}, {x:10, y:-10}, mockObjects)
    
            })
    
            test('one object in the array', () => {
                expect(mockObjects).toHaveLength(1)
    
            })
    
            test('the object added was a slab', () => {
                let potentialBall = mockObjects[0]
                expect(potentialBall instanceof index.Slab).toBeTruthy()
            })
    
            test('slab has correct center', () => {
                let slab = mockObjects[0]
    
                expect(slab.x).toBeCloseTo(0)
                expect(slab.y).toBeCloseTo(0)
            })
    
            test('slab has correct angle', () => {
                let slab = mockObjects[0]
    
                expect(slab.angle).toBeCloseTo(3*Math.PI/4)
            })
    
            test('slab has zero velocity', () => {
                let slab = mockObjects[0]
    
                expect(slab.vx).toBeCloseTo(0)
                expect(slab.vy).toBeCloseTo(0)
            })
        })
    })

})
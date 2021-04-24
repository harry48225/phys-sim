const index = require("./index")

describe("Vector", () => {
    test('length of (3,4) to equal 5', () => {
        expect(new index.Vector(3,4).getLength()).toBe(5)
    })
})

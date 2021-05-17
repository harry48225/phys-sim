function Vector(x, y) {
    // all methods return a new vector
    this.x = x
    this.y = y
    
    this.add = function (vector) { 
        return new Vector(this.x + vector.x, this.y + vector.y)
    }

    this.subtract = function (vector) {

        return new Vector(this.x, this.y).add(vector.scale(-1))
    }

    // returns euclidean length
    this.getLength = function () {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2))
    }

    this.normalise = function () {
        let length = this.getLength()
        return new Vector(this.x / length, this.y / length)

    }

    this.scale = function (scale) {
        return new Vector(this.x * scale, this.y * scale)
    }

    // rotates the vector anticlockwise by the given angle in radians
    this.rotate = function (angle) {

        let new_x = this.x*Math.cos(angle) - this.y*Math.sin(angle)
        let new_y = this.x*Math.sin(angle) + this.y*Math.cos(angle)

        return new Vector(new_x, new_y)
    }

    // dot product
    this.dot = function (vector) {
        return this.x * vector.x + this.y * vector.y
    }
}

module.exports = Vector
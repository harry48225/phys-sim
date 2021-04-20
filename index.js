function drawRect() {
    const canvas = document.getElementById('canvas')
    let ctx = canvas.getContext('2d')
    ctx.fillStyle = 'rgb(200, 0, 0)'
    ctx.fillRect(10,10,50,50)
}
function getCanvas() {
    return document.getElementById('canvas')
}

function startDrawing(ctx) {
    let saved = ctx.save()
    ctx.translate(0, getCanvas().height)
    ctx.scale(1,-1)

    return saved
}

function stopDrawing(ctx, savedState) {
    ctx.restore(savedState)
}

function getCanvasContext() {
    return getCanvas().getContext('2d')
}

module.exports = {
    getCanvas : getCanvas,
    startDrawing : startDrawing,
    stopDrawing : stopDrawing,
    getCanvasContext : getCanvasContext,
}
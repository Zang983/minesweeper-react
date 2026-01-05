export default function cellNeighbors(index: number, height: number, width: number) {
    const neighbors = []
    const haveTopNeighbors = index >= width
    const haveBottomNeighbors = index < (height - 1) * width
    const haveLeftNeighbors = index % width !== 0
    const haveRightNeighbors = (index + 1) % width !== 0

    if (haveTopNeighbors) {
        neighbors.push(index - width)
        if (haveLeftNeighbors)
            neighbors.push(index - width - 1)
        if (haveRightNeighbors)
            neighbors.push(index - width + 1)
    }
    if (haveBottomNeighbors) {
        neighbors.push(index + width)
        if (haveLeftNeighbors)
            neighbors.push(index + width - 1)
        if (haveRightNeighbors)
            neighbors.push(index + width + 1)
    }
    if (haveLeftNeighbors) neighbors.push(index - 1)
    if (haveRightNeighbors) neighbors.push(index + 1)
    return neighbors;
}

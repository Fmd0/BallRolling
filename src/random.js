
const randomPosition3D = (scale) => {
    const x = (Math.random()-0.5)*scale;
    const z = (Math.random()-0.5)*scale/3*2;
    const y = (-z-x)*0.27+5+10*Math.random();
    return [x, y, z]
}

const randomImpulse = (scale) => {
    const x = Math.random()*scale;
    const y = -3-Math.random()*scale;
    return [x, y, 0]
}



export {
    randomPosition3D,
    randomImpulse
}
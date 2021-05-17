import { Vec3 } from './vector/base'

const vec1 = new Vec3(1, 1, 1)
const vec2 = new Vec3(0.5, 0.5, 0.5)
const vecZero = new Vec3(0, 0, 0)
const number = 2
console.log(Vec3.plus(number, vec1, vec2, vecZero))
console.log(Vec3.multi(number, vec1, vec2, vecZero))
console.log(Vec3.minus(number, vec1, vec2, vecZero))
import { writeFileSync } from 'fs'
import { createImage } from './image/create'
const ppmStr = createImage(200, 200)
writeFileSync('test.ppm', ppmStr)

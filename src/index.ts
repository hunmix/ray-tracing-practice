import { writeFileSync } from 'fs'
import { getColor, Color, Point3, Vec3 } from './vector'
import { rayColor, Ray } from './ray'
import { HitRecord, Sphere } from './hittable/index'
import { HittableList } from './hittable/hittableList'
import { Camera } from './camera'
import { random } from './utils/index'
import { LambertianMaterial, Metal, Dielectric } from './material'


const ASPECT_RATIO = 3 / 2
const IMAGE_WIDTH = 1200
const IMAGE_HEIGHT = IMAGE_WIDTH / ASPECT_RATIO
const SAMPLES_PER_PIXEL = 50
const MAX_DEPTH = 50
const lookFrom = new Point3(13, 2, 3)
const lootAt = new Point3(0, 0, 0)
const vup = new Vec3(0, 1 ,0)
// const distToFocus = Vec3.minus(lookFrom, lootAt).length()
const distToFocus = 10
const aperture = 0.1

// world
const world = new HittableList()

// const materialGround = new LambertianMaterial(new Color(0.8, 0.8, 0))
// const materialCenter = new LambertianMaterial(new Color(0.1, 0.2, 0.5))
// const materialLeft = new Dielectric(1.5)
// const materialRight = new Metal(new Color(0.8, 0.6, 0.2), 0)

// world.add(new Sphere(new Point3(0, -100.5, -1), 100, materialGround))
// world.add(new Sphere(new Point3(0, 0, -1), 0.5, materialCenter))
// world.add(new Sphere(new Point3(-1, 0, -1), 0.5, materialLeft))
// world.add(new Sphere(new Point3(-1, 0, -1), -0.4, materialLeft))
// world.add(new Sphere(new Point3(1, 0, -1), 0.5, materialRight))

// const R = Math.cos(Math.PI / 4)
// const materialLeft = new LambertianMaterial(new Color(0, 0, 1))
// const materialRight = new LambertianMaterial(new Color(1, 0, 0))

// world.add(new Sphere(new Point3(-R, 0, -1), R, materialLeft))
// world.add(new Sphere(new Point3(R, 0, -1), R, materialRight))

// const materialGround = new LambertianMaterial(new Color(0.8, 0.8, 0))
// const materialCenter = new LambertianMaterial(new Color(0.1, 0.2, 0.5))
// const materialLeft = new Dielectric(1.5)
// const materialRight = new Metal(new Color(0.8, 0.6, 0.2), 0)

// world.add(new Sphere(new Point3(0, -100.5, -1), 100, materialGround))
// world.add(new Sphere(new Point3(0, 0, -1), 0.5, materialCenter))
// world.add(new Sphere(new Point3(-1, 0, -1), 0.5, materialLeft))
// world.add(new Sphere(new Point3(-1, 0, -1), -0.45, materialLeft))
// world.add(new Sphere(new Point3(1, 0, -1), 0.5, materialRight))

hittableListRandomScene(world)

const material1 = new Dielectric(1.5)
const material2 = new LambertianMaterial(new Color(0.4, 0.2, 0.1))
const material3 = new Metal(new Color(0.7, 0.6, 0.5), 0)

world.add(new Sphere(new Point3(0, 1, 0), 1, material1))
world.add(new Sphere(new Point3(-4, 1, 0), 1, material2))
world.add(new Sphere(new Point3(4, 1, 0), 1, material3))



// camera
// const camera = new Camera(new Point3(-2, 2, 1), new Point3(0, 0, -1), new Vec3(0, 1, 0), 90, ASPECT_RATIO)
const camera = new Camera(lookFrom, lootAt, vup, 20, ASPECT_RATIO, aperture, distToFocus)
// const viewportHeight = 2
// const viewportWidth = ASPECT_RATIO * viewportHeight
// const focalLength = 1

// const origin = new Point3(0, 0, 0)
// const horizontal = new Vec3(viewportWidth, 0, 0)
// const vertical = new Vec3(0, viewportHeight, 0)
// const lowerLeftCorner = Vec3.minus(origin, Vec3.divide(horizontal, 2), Vec3.divide(vertical, 2), new Vec3(0, 0, focalLength))

function hittableListRandomScene(world: HittableList) {
  const groundMaterial = new LambertianMaterial(new Color(0.5, 0.5, 0.5))
  world.add(new Sphere(new Point3(0, -1000, 0), 1000, groundMaterial))

  for(let a = -11; a < 11; a++) {
    for(let b = -11; b < 11; b++) {
      const chooseMat = random()
      const center = new Point3(a + 0.9 * random(), 0.2, b +  0.9 * random())
      let sphereMaterial
      if (chooseMat < 0.8) {
        sphereMaterial = new LambertianMaterial(new Color(random(), random() ,random()))
      } else if (chooseMat < 0.95){
        const albedo = random(0.5, 1)
        const fuzz = random(0, 0.5)
        sphereMaterial = new Metal(new Color(albedo, albedo, albedo), fuzz)
      } else {
        sphereMaterial = new Dielectric(1.5)
      }
      world.add(new Sphere(center, 0.2, sphereMaterial))
    }
  }
}

let ppmStr = ''

const header = `P3 ${IMAGE_WIDTH} ${IMAGE_HEIGHT} \n255\n`

ppmStr += header

let body = ''
for(let j = IMAGE_HEIGHT - 1; j >= 0; --j) {
  console.error(`\rScanlines remaining: ${j}`)
  for(let i = 0; i < IMAGE_WIDTH; ++i) {
    let pixelColor = new Color(0, 0, 0)
    for(let s = 0; s < SAMPLES_PER_PIXEL; ++s) {
      const u = (i + random()) / (IMAGE_WIDTH - 1)
      const v = (j + random()) / (IMAGE_HEIGHT - 1)
      const ray = camera.getRay(u, v)
      pixelColor = Vec3.plus(pixelColor, rayColor(ray, world, MAX_DEPTH))
      // console.log(1)
    }
    // const pixelColor = rayColor(ray, world)

    body += `${getColor(pixelColor, SAMPLES_PER_PIXEL)}\n`
  }
}
ppmStr += body

console.error(`\nDone.\n`)

writeFileSync('image.ppm', ppmStr)

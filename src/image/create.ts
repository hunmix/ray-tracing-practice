export const createImage = (width: number, height: number): string => {
  let ppmStr = ''
  
  const header = `P3 ${width} ${height} \n255\n`
  
  ppmStr += header
  
  let body = ''
  
  for(let j = height - 1; j >= 0; j--) {
    for(let i = 0; i < width; i++) {
      const r = Math.floor((i / (width - 1)) * 255)
      const g = Math.floor((j / (height - 1)) * 255)
      const b = Math.floor(0.25 * 255)
  
      body += `${r} ${g} ${b} \n`
    }
  }
  ppmStr += body
  
  return ppmStr
}

// const { ENV } = process.env
console.log('process.env------------------------', process.env)

const map = new Map([
//   ['dev', 'http://local.sldshop.com'],
  ['development', '/api/'],
  ['production', 'http://mall-bsy.vxwei.com/'],
])

export default map

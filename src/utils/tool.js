const ua = window.navigator.userAgent.toLowerCase()

const isAliPayApp = () => ua.includes('alipayclient')

// eslint-disable-next-line no-param-reassign
const stringify = obj => Object.entries(obj).reduce((pre, cur) => pre += `&${cur.join('=')}`, '').replace(/^./ig, '?')

export {
  isAliPayApp,
  stringify,
}

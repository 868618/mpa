const ua = window.navigator.userAgent.toLowerCase()

const isAliPayApp = () => ua.includes('alipayclient')
const isWeChat = () => ua.match(/MicroMessenger/i) && ua.match(/MicroMessenger/i)[0] === 'micromessenger'

console.log('isWeChat', isWeChat())

// eslint-disable-next-line no-param-reassign
const stringify = obj => Object.entries(obj).reduce((pre, cur) => pre += `&${cur.join('=')}`, '').replace(/^./ig, '?')

const secondToTime = time => {
  // eslint-disable-next-line radix
  const result = parseInt(Number(time))
  const floorH = Math.floor(result / 3600)
  // eslint-disable-next-line no-mixed-operators
  const floorM = Math.floor((result / 60 % 60))
  const floorS = Math.floor((result % 60))

  const h = floorH < 10 ? `0${floorH}` : floorH
  const m = floorM < 10 ? `0${floorM}` : floorM
  const s = floorS < 10 ? `0${floorS}` : floorS

  return `${h}:${m}:${s}`
}

export {
  isAliPayApp,
  stringify,
  secondToTime,
  isWeChat,
}

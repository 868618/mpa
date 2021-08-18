const ua = window.navigator.userAgent.toLowerCase()

const isAliPayApp = () => ua.includes('alipayclient')

const a = 123

export {
  a,
  isAliPayApp,
}

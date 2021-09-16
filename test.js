// const args = Object.fromEntries()

// process.env.uuuuu = args
// console.log(JSON.stringify(args))

// console.log(process.argv.slice(2).map(i => i.split('=')))

process.argv.slice(2).map(i => i.split('=')).forEach(([k, v]) => process.env[k] = v)

console.log(process.env)

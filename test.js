const args = Object.fromEntries(process.argv.slice(2).map(i => i.split('=')))
console.log(args)

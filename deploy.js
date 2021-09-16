const fs = require('fs');
// const ora = require('ora')
// import ora from 'ora'

// const chalk = require('chalk')
// import chalk from 'chalk'

const path = require('path');

const { NodeSSH } = require('node-ssh');

const ssh = new NodeSSH()

// host: '82.156.50.191',
// port: '22',
// username: 'qianduan',
// privateKey: fs.readFileSync('./id_rsa')

// const localPath = path.join(__dirname, './test')
// const remotePath = '/www/wwwroot/wechat.emailvx.com/'

// const { _host: host, _username: username, _privateKey: privateKey } = process.env

const config = {
  service: {
    host: '82.156.50.191',
    port: '22',
    username: 'qianduan',
    privateKey: fs.readFileSync('./id_rsa'),
  },
}

const upload = async () => {
//   const spinner_connect = ora('正在连接远端服务器...')
//   spinner_connect.start()
  await ssh.connect(config.service)
  //   spinner_connect.stop()

  //   const spinner_upload = ora('准备上传文件')
  const localPath = path.join(__dirname, './public')
  const remotePath = '/www/wwwroot/wechat.emailvx.com/'
  //   spinner_upload.start()
  await ssh.putDirectory(localPath, remotePath, {
    recursive: true,
    concurrency: 10,
    tick(l, r, error) {
    //   error ? console.log(chalk.red(error)) : (spinner_upload.text = `正在上传文件：${l}`)
    //   error ? console.log(chalk.red()) : console.log(chalk.yellow(l))
      console.log(error || l)
    },
  })

  //   spinner_upload.stop()
  //   console.log(chalk.green('success'))
  console.log('success')
  ssh.connection.end()
}

upload()

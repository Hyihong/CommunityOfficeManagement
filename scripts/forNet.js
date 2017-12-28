'use strict';

// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';

// In the future, promise rejections that are not handled will terminate the Node.js process with a non-zero exit code.
//如果在事件循环的一次轮询中，一个Promise被rejected，并且此Promise没有绑定错误处理器，'unhandledRejection事件会被触发。 
// 当使用Promises进行编程时，异常会以"rejected promises"的形式封装。
//Rejections可以被promise.catch()捕获并处理，并且在Promise chain 中传播。
//'unhandledRejection事件在探测和跟踪promises被rejected，并且rejections未被处理的场景中是很有用的。
process.on('unhandledRejection', err => {
  throw err;
});

// Ensure environment variables are read.
require('../config/env');

const path = require('path');
const chalk = require('chalk');
const fs = require('fs-extra');
const webpack = require('webpack');
const config = require('../config/webpack.config.forNet');
const paths = require('../config/paths');
const checkRequiredFiles = require('react-dev-utils/checkRequiredFiles');
const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages');

// Warn and crash if required files are missing

if (!checkRequiredFiles([paths.appHtml, paths.appIndexJs])) {
  process.exit(1);
}

 fs.emptyDirSync(paths.appBuild);//删除文件夹下的文件，但是保存目录 
 copyPublicFolder();// 复制public文件夹到输出文件中

// 开始用webpack进行编译打包
    build().then(
    ({  warnings }) => {
      if (warnings.length) {
         console.log(chalk.yellow('Compiled with warnings.\n'));
      } else {
        console.log(chalk.green('Compiled successfule，and on the watching mod, enjoy coding...!\n'));
      }

    },

    err => {
      console.log(chalk.red('编译失败.\n'));
      console.log((err.message || err) + '\n');
      process.exit(1);
    }
  );

// Create the production build and print the deployment instructions.创建构建并打印部署生产指令
function build() {
  console.log( chalk.magenta('compiling...\n') );

  let compiler = webpack(config); //返回compiler instance

  return new Promise((resolve, reject) => {
    compiler.watch({},(err, stats) => {
      if (err) {
        return reject(err);
      }
      const messages = formatWebpackMessages(stats.toJson({}, true));
      if (messages.errors.length) {
        return reject(new Error(messages.errors.join('\n\n')));
      }
      if (
        process.env.CI &&
        (typeof process.env.CI !== 'string' ||
          process.env.CI.toLowerCase() !== 'false') &&
        messages.warnings.length
      ) {
        console.log(
          chalk.yellow(
            '\nTreating warnings as errors because process.env.CI = true.\n' +
              'Most CI servers set it automatically.\n'
          )
        );
        return reject(new Error(messages.warnings.join('\n\n')));
      }
      return resolve({
        warnings: messages.warnings,
      });
    });
  });
}

function copyPublicFolder() {
  fs.copySync(paths.appPublic, paths.appBuild, {
    dereference: true,
    filter: file => file !== paths.appHtml,
  });
}

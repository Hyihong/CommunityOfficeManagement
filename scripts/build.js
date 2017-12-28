
'use strict';

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
const config = require('../config/webpack.config.prod');
const config_m = require('../config/webpack.config.prod.m');
const paths = require('../config/paths');
const checkRequiredFiles = require('react-dev-utils/checkRequiredFiles');
const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages');
const printHostingInstructions = require('react-dev-utils/printHostingInstructions');
const FileSizeReporter = require('react-dev-utils/FileSizeReporter');

const measureFileSizesBeforeBuild = FileSizeReporter.measureFileSizesBeforeBuild;
const printFileSizesAfterBuild = FileSizeReporter.printFileSizesAfterBuild;
//const useYarn = fs.existsSync(paths.yarnLockFile); old
const useYarn = false;

// These sizes are pretty large. We'll warn for bundles exceeding them.
const WARN_AFTER_BUNDLE_GZIP_SIZE = 512 * 1024; //0.5M 
const WARN_AFTER_CHUNK_GZIP_SIZE = 1024 * 1024; //1M

// Warn and crash if required files are missing

if (!checkRequiredFiles([paths.appHtml, paths.appIndexJs])) {
   process.exit(1);
}

const _target = process.argv[2];
switch( _target ){
   case undefined :{
      integrateForProduction( paths.appBuild, paths.appPublic, paths.appBuild,config);
      break;
   }
   case 'pc':{
      integrateForProduction( paths.appBuild, paths.appPublic, paths.appBuild,config);
      break;
   }
   case 'mobile':{
      integrateForProduction( paths.appBuild_m, paths.appPublic, paths.appBuild_m,config_m);
      break;
   }
   default:{
      console.log("bad option : _target ");
   }
}

//文件操作及编译
function integrateForProduction( buildPath,public_file_source, public_file_target,cfg){

  measureFileSizesBeforeBuild(buildPath)
  .then(previousFileSizes => {
  
    fs.emptyDirSync(buildPath)
    copyPublicFolder(public_file_source,public_file_target);// 复制public文件夹到输出文件中
     
    return build(previousFileSizes,cfg); // 开始用webpack进行编译打包
  })
  .then(
    ({ stats, previousFileSizes, warnings, target}) => {
      if (warnings.length) {
        console.log(chalk.yellow('Compiled with warnings.\n'));
        console.log(warnings.join('\n\n'));
        console.log(  '\nSearch for the ' + chalk.underline(chalk.yellow('keywords')) + ' to learn more about each warning.');
        console.log( 'To ignore, add ' + chalk.cyan('// eslint-disable-next-line') + ' to the line before.\n' );
      } else {
        console.log(chalk.green('编译成功!\n'));
      }
  
      console.log( chalk.magenta('gzip后文件大小:') );
      printFileSizesAfterBuild(
        stats,
        previousFileSizes,
        buildPath,
        WARN_AFTER_BUNDLE_GZIP_SIZE,
        WARN_AFTER_CHUNK_GZIP_SIZE
      );
      console.log();
  
      //打印主机指令
      const appPackage = require(paths.appPackageJson);
      const publicUrl = paths.publicUrl;
      const publicPath = config.output.publicPath;
      const buildFolder = path.relative(process.cwd(), buildPath);
  
      printHostingInstructions(
        appPackage,
        publicUrl,
        publicPath,
        buildFolder,
        useYarn
      );
    },
  
    err => {
      console.log(chalk.red('编译失败.\n'));
      console.log((err.message || err) + '\n');
      process.exit(1);
    }
  );


}

// Create the production build and print the deployment instructions.
function build(previousFileSizes,cfg) {
  console.log( chalk.magenta(`正在构建【办事处系统】${!!_target ? _target : "pc"}版,请耐心等待...\n`) );

  let compiler = webpack(cfg); //返回compiler instance
  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
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
        stats,
        previousFileSizes,
        warnings: messages.warnings,
      });
    });
  });
}


function copyPublicFolder(soucre,target) {
  fs.copySync(soucre, target, {
    dereference: true,
    filter: file => file !== paths.appHtml,
  });
}

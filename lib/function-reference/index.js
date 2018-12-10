'use strict';

// source to extend https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/top-level-namespace.html
// latest on 27.11.2018

let list = [];
list = list
  .concat(require('./cognito').list)
  .concat(require('./dynamo-db').list)
  .concat(require('./lambda').list)
  .concat(require('./s3').list);

exports.services = list;

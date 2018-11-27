'use strict';

const sinon = require('sinon');
const uuidv4 = require('uuid/v4')();
const awsSdk = require('aws-sdk');
const merge = require('deepmerge');
const stubExpect = require('./lib/stub-expect');

let mockAwsServices = function () {
  Object.keys(stubList).forEach(apiCall => {
    let tree = apiCall.split('.');
    if (tree.length <= 1) {
      throw new Error(apiCall + ' is not a valid path to a service')
    }

    let functionName = tree.pop();

    let api = awsSdk;
    tree.forEach(elem => {
      api = api[elem];
    });

    stubList[apiCall] = setStub(api, functionName)
  });
};

function setStub(api, functionName) {
  let stub = sinon.stub();
  stubExpect.extendStub(stub);
  api.prototype[functionName] = stub;
  stubReset(stub);

  return stub;
}

function setupTest() {
  Object.keys(stubList).forEach(apiCall => {
    stubReset(apiCall);
  });
}

function stubReset(stub) {
  stub.reset();
  stub.resetHistory();
  stub.returns(defaultBehavior);
}

let stubList = {};

let defaultBehavior = stubExpect.getPromiseRejectObj('default reject ' + uuidv4);
let stubTearDownError = 'fail';

let init = function (options) {
  let awsServices = require('./lib/function-reference/index').services;

  if (typeof options !== "undefined") {
    if (options.hasOwnProperty('defaultBehavior')) {
      setDefaultBehavior(options);
    }
    if (options.hasOwnProperty('tearDown')) {
      stubTearDownError = options.tearDown;
    }
    if (options.hasOwnProperty('awsServices')) {
      merge(awsServices, options.awsServices)
    }
  }

  awsServices.forEach(service => {
    stubList[service] = null;
  });

  mockAwsServices()
};

let setDefaultBehavior = function (options) {
  if (typeof options.defaultBehavior === 'function') {
    defaultBehavior = options.defaultBehavior;

    return
  }

  if (options.defaultBehavior === 'resolve') {
    defaultBehavior = stubExpect.getPromiseObj('default resolve ' + uuidv4());
  }

  throw new Error('defaultBehavior invalid');
};

let getStub = function (key) {
  if (stubList.hasOwnProperty(key)) {
    return stubList[key];
  }

  return null;
};

let expectReject = function (stubKey, result) {
  getStub(stubKey).expectReject(result);
};

let expectResolve = function (stubKey, result) {
  getStub(stubKey).expectResolve(result);
};

let expectRejectWith = function (stubKey, params, result) {
  getStub(stubKey).expectRejectWith(params, result);
};

let expectResolveWith = function (stubKey, params, result) {
  getStub(stubKey).expectResolveWith(params, result);
};

init();
exports.expectReject = expectReject;
exports.expectResolve = expectResolve;
exports.expectRejectWith = expectRejectWith;
exports.expectResolveWith = expectResolveWith;

exports.init = init;
exports.setup = setupTest;
exports.getStub = getStub;


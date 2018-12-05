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

  return stub;
}

function setupTest() {
  Object.keys(stubList).forEach(stub => {
    stubReset(stub);
  });
}

function stubReset(functionName) {
  stubList[functionName].reset();
  stubList[functionName].resetHistory();
  stubList[functionName].returns(defaultBehavior);
}

function tearDown() {
  Object.keys(stubList).forEach(stub => {
    checkOnTearDown(stub);
    stubReset(stub);
  });
}

function checkOnTearDown(functionName) {
  let stub = stubList[functionName];

  try {
    stub.assertedCallCount(stub.assertedCallCount)
  } catch (e) {
    switch (e) {
      case 'fail':
        throw e;

      default:
        console.log(e);
    }
  }
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

let expectReject = function (stubKey, result, expectedCallCount) {
  getStub(stubKey).expectReject(result, expectedCallCount);
};

let expectResolve = function (stubKey, result, expectedCallCount) {
  getStub(stubKey).expectResolve(result, expectedCallCount);
};

let expectRejectWith = function (stubKey, params, result, expectedCallCount) {
  getStub(stubKey).expectRejectWith(params, result, expectedCallCount);
};

let expectResolveWith = function (stubKey, params, result, expectedCallCount) {
  getStub(stubKey).expectResolveWith(params, result, expectedCallCount);
};

let assertCallCount = function (stubKey, callCount, expectedCallCount) {
  getStub(stubKey).assertCallCount(callCount, expectedCallCount);
};

init();
exports.expectReject = expectReject;
exports.expectResolve = expectResolve;
exports.expectRejectWith = expectRejectWith;
exports.expectResolveWith = expectResolveWith;

exports.assertCallCount = assertCallCount;

exports.init = init;
exports.setup = setupTest;
exports.tearDown = tearDown;
exports.getStub = getStub;


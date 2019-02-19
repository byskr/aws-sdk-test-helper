'use strict';

const sinon = require('sinon');

function extendStub(stub, functionName) {
  stub.expectReject = expectReject;
  stub.expectResolve = expectResolve;
  stub.expectRejectWith = expectRejectWith;
  stub.expectResolveWith = expectResolveWith;

  stub.assertCallCount = assertCallCount;
  stub.assertedCallCount = 0;
  stub.functionName = functionName;
}

let getPromiseObj = function (resolveValue) {
  return {
    promise: sinon.stub().resolves(resolveValue)
  };
};

let getPromiseRejectObj = function (reason) {
  if(typeof reason === "string" && reason.includes('default reject')) {
    reason = `${this.functionName}: ${reason}`
  }

  return {
    promise: sinon.stub().rejects(reason)
  };
};

function expectReject(result, expectedCallCount) {
  this.assertedCallCount += oneOrNumber(expectedCallCount);
  this.returns(
    getPromiseRejectObj(result)
  );
}

function expectResolve(result, expectedCallCount) {
  this.assertedCallCount += oneOrNumber(expectedCallCount);
  this.returns(
    getPromiseObj(result)
  );
}

function expectRejectWith(params, result, expectedCallCount) {
  this.assertedCallCount += oneOrNumber(expectedCallCount);
  this
    .withArgs(params)
    .returns(
      getPromiseRejectObj(result)
    );
}

function expectResolveWith(params, result, expectedCallCount) {
  this.assertedCallCount += oneOrNumber(expectedCallCount);
  this
    .withArgs(params)
    .returns(
      getPromiseObj(result)
    );
}

function assertCallCount(callCount) {
  if (this.callCount !== callCount) {
    throw new Error(this.functionName + ': Call count not as expected');
  }
}

function oneOrNumber(number) {
  if (isNaN(number)) {
    return 1;
  }

  return number;
}

exports.assertCallCount = assertCallCount;

exports.expectReject = expectReject;
exports.expectResolve = expectResolve;
exports.expectRejectWith = expectRejectWith;
exports.expectResolveWith = expectResolveWith;

exports.extendStub = extendStub;
exports.getPromiseRejectObj = getPromiseRejectObj;
exports.getPromiseObj = getPromiseObj;

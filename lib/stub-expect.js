'use strict';

const sinon = require('sinon');

let getPromiseObj = function (resolveValue) {
  return {
    promise: sinon.stub().resolves(resolveValue)
  };
};

let getPromiseRejectObj = function (reason) {
  return {
    promise: sinon.stub().rejects(reason)
  };
};

function expectReject(result) {
  this.returns(
    getPromiseRejectObj(result)
  );
}

function expectResolve(result) {
  this.returns(
    getPromiseObj(result)
  );
}

function expectRejectWith(params, result) {
  this
    .withArgs(params)
    .returns(
      getPromiseRejectObj(result)
    );
}

function expectResolveWith(params, result) {
  this
    .withArgs(params)
    .returns(
      getPromiseObj(result)
    );
}

function extendStub(stub) {
  stub.expectReject = expectReject;
  stub.expectResolve = expectResolve;
  stub.expectRejectWith = expectRejectWith;
  stub.expectResolveWith = expectResolveWith;
}

exports.expectReject = expectReject;
exports.expectResolve = expectResolve;
exports.expectRejectWith = expectRejectWith;
exports.expectResolveWith = expectResolveWith;
exports.extendStub = extendStub;
exports.getPromiseRejectObj = getPromiseRejectObj;
exports.getPromiseObj = getPromiseObj;

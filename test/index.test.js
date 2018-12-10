'use strict';
const expect = require('chai').expect;
let helper = require('./../index');

function runTestsOnStub(testStub) {
  expect(testStub).to.be.a('function');
  expect(testStub.expectReject).to.be.a('function');
  expect(testStub.expectResolve).to.be.a('function');
  expect(testStub.expectRejectWith).to.be.a('function');
  expect(testStub.expectResolveWith).to.be.a('function');
  expect(testStub.assertCallCount).to.be.a('function');
  expect(testStub.assertedCallCount).to.equal(0);
}


describe('aws sdk test helper', () => {
  describe('init', () => {
    it('should be ready with basic settings', () => {
      let i = 0;
      let expectedServiceCount = 160;

      require('./../lib/function-reference/index').services.forEach((service) => {
        runTestsOnStub(helper.getStub(service));

        i++
      });
      expect(i).to.equal(expectedServiceCount);
    });

    it('should init with additional services', () => {
      let i = 0;
      let expectedServiceCount = 162;

      helper.init({
        awsServices : [
          'AlexaForBusiness.approveSkill'
        ]
      });

      require('./../lib/function-reference/index').services.forEach((service) => {
        runTestsOnStub(helper.getStub(service));
        i++
      });
      expect(i).to.equal(expectedServiceCount);
    });
  });
});

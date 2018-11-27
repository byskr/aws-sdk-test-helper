'use strict';

'use strict';

const sinon = require('sinon');
const awsSdk = require('aws-sdk');

const awsServiceDefaults = {
    S3: {
        Functions: [
            'putObject',
            'getBucketLifecycleConfiguration',
            'putBucketLifecycleConfiguration'
        ]
    },
    DynamoDB: {
        Functions: '*',
        DocumentClient: {
            Functions: '*'
        }
    },
    Lambda: {
        Functions: [
            'invoke'
        ]
    }
};


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

let returnsPromise = function (stub, params, resolves) {
    stub
        .withArgs(params)
        .returns(
            getPromiseObj(resolves)
        );
};

let rejectsPromise = function (stub, params, reject) {
    stub
        .withArgs(params)
        .returns(
            getPromiseRejectObj(reject)
        );
};

let mockAwsServices = function (awsServices, defaultBehavior) {


    if (typeof awsServices === 'undefined' || Object.keys(awsServices).length === 0) {
        awsServices = awsServiceDefaults;
    }

    if (defaultBehavior === undefined) {
        defaultBehavior = getPromiseRejectObj('default reject');
    }

    iterateServices(awsSdk, awsServices, defaultBehavior);
};


function iterateServices(aws, services, defaultBehavior) {
    const serviceKeys = Object.keys(services);

    for (let i = 0; i < serviceKeys.length; i++) {
        let key = serviceKeys[i];

        if (services[key].hasOwnProperty('Functions')) {
            setStubs(aws[key].prototype, services[key].Functions, defaultBehavior);
            delete services[key].Functions;
        }

        iterateServices(aws[key], services[key], defaultBehavior);
    }
}

function setStubs(aws, functionList, defaultBehavior) {
    if (functionList === '*') {
        functionList = [];
        Object.getOwnPropertyNames(aws).forEach(function (p) {
            if (typeof aws[p] === 'function' && p !== 'constructor' && p !== 'configure' && p !== 'bindServiceObject' && p !== 'validateService') {
                functionList.push(p);
            }
        });
    }

    if (functionList === null) {
        return;
    }

    functionList.forEach((functionName) => {
        aws[functionName] = sinon.stub();
        aws[functionName].returns(defaultBehavior);
    });
}


exports.mockAwsServices = mockAwsServices;
exports.getPromiseObj = getPromiseObj;
exports.getPromiseRejectObj = getPromiseRejectObj;
exports.returnsPromise = returnsPromise;
exports.rejectsPromise = rejectsPromise;

# aws-sdk-test-helper

this package set a stubs to the api functions of the aws sdk

currently following services are handled

  - DynamoDB
  - DynamoDB.DocumentClient
  - Lambda
  - S3
  
New Services and function can be appended in the folder lib/function-reference

The default behaviour of every stub is to set to be used as promise and reject any call with a default message

...

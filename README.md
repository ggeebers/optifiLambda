# OptifiFootprintAnalytics

## Optifi AWS Lambda Router Function to Handle AWS API Gateway
- original test implementation on us-west-1
    - RDS hosting PostGresQL database free tier
- prod to be implemented on Singapore ap-southeast-1
    - RDS hosting PostGresQL database Dev tier
- currently using sequelize to query database
- API Gateway -> Lambda Function -> RDS Database

## To Update Lambda Function on AWS
- zip files within repo and import into Lambda Function to replace existing code
    - file size to too large, which will prevent AWS web IDE
- make sure that environmental variables for the RDS Database are properly entered in the lambda function

## To Run/Test on Ready Code on AWS
To test via the API Gateway test buttons
- make sure the Lambda Function is up to date
- make sure to add environmental variables from RDS Database to Lambda Function
- make sure the API Gateway routes match the Lambda Function Lambda Router routes

To test via Postman
- follow previous steps
- make sure API Gateway is deployed
- use the API url provided for deployed API

## To Test Service Functions Locally
- npm install (install packages)
- run functions within the auto-invoking async function
- node service.js (run the service.js file)

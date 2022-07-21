'use strict';

module.exports.generateRandomNumber =  (event) => {

  const randomNumber = parseInt(Math.random()*100);
  console.log( `Random number is ${randomNumber}`);
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Go Serverless v1.0! Your function executed successfully!',
        input: randomNumber,
      },
      null,
      2
    ),
  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};


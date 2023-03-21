import AWS from "aws-sdk";

const dynamoDb = new AWS.DynamoDB.DocumentClient({
  region: process.env.REGION,
});

export default async function handler(req, res) {
  const getParams = {
    TableName: process.env.COUNTER_TABLE,
    Key: {
      counter: "hits",
    },
  };

  const results = await dynamoDb.get(getParams).promise();

  let count = results.Item ? results.Item.tally : 0;

  const putParams = {
    TableName: process.env.COUNTER_TABLE,
    Key: {
      counter: "hits",
    },
    UpdateExpression: "set tally = :count",
    ExpressionAttributeValues: {
      ":count": ++count,
    },
  };

  await dynamoDb.update(putParams).promise();

  res.status(200).send(count);
}

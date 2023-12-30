// Upload this file to AWS Lambda
import AWS from 'aws-sdk';

const sns = new AWS.SNS();

// This function will be triggered by the GitHub API
// It will publish a message to an SNS topic
// The SNS topic will trigger the second Lambda function (the expensive one)
export async function handler(event) {
    // Parse the message from the GitHub API
    const prNumber = JSON.parse(event.body).pr_id;
    // TODO: Replace with your own SNS topic ARN
    const snsTopicArn = '';

    const message = {
        prNumber,
        // any other necessary data
    };

    // Publish message to SNS topic
    await sns.publish({
        TopicArn: snsTopicArn,
        Message: JSON.stringify(message)
    }).promise();

    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Triggered second Lambda function' })
    };
}

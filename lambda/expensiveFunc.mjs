import fetch from 'node-fetch';

// TODO: Replace with your own GitHub token
const GITHUB_TOKEN = '';
// TODO: Replace with your own GitHub name
const REPO_OWNER = 'lp-mkdir';
// TODO: Replace with your own GitHub repo
const REPO_NAME = 'gh-check-api-lambda';

export async function handler(event) {
    // Parse the message from the SNS notification
    const snsMessage = JSON.parse(event.Records[0].Sns.Message);
    const prNumber = snsMessage.prNumber;

    // Simulate a long-running task
    await new Promise(resolve => setTimeout(resolve, 1 * 60 * 1000));

    // Dispatch event to GitHub
    const githubApiUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/dispatches`;
    const payload = {
        // Must match the name of the workflow file
        // Add same for the github status check rules
        event_type: 'lambda-test-results', // Must match the event type in the workflow file
        client_payload: {
            prNumber
        }
    };

    const response = await fetch(githubApiUrl, {
        method: 'POST',
        headers: {
            'Authorization': `token ${GITHUB_TOKEN}`,
            'User-Agent': 'AWS-Lambda-Function',
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`GitHub API responded with ${response.status}: ${errorData}`);
    }

    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'GitHub dispatch event triggered' })
    };
}

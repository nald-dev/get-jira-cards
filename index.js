import core from "@actions/core";
import github from "@actions/github";

import fetch, { Headers } from "node-fetch";
import base64 from "base-64";

try {
  const projectName = core.getInput("project_name");

  const jiraBaseURL = core.getInput("jira_base_url");
  const jiraUsername = core.getInput("jira_username");
  const jiraToken = core.getInput("jira_token");
  const jiraTargetStatus = core.getInput("jira_target_status");

  const headers = new Headers();

  headers.append(
    "Authorization",
    "Basic " + base64.encode(jiraUsername + ":" + jiraToken)
  );

  fetch(`${jiraBaseURL}/rest/api/2/search?jql=status='${jiraTargetStatus}'`, {
    method: "GET",
    headers: headers,
  })
    .then((response) => response.json())
    .then((json) => {
      let newReleaseMessage = "";

      newReleaseMessage += `${projectName}'s New Release`;

      newReleaseMessage += `\n\nDate Time: ${new Date().toLocaleString()}\n`;

      json.issues.forEach((item) => {
        newReleaseMessage += `\n- ${item.fields.summary}`;
      });

      console.log(newReleaseMessage);
      core.setOutput("newReleaseMessage", newReleaseMessage);
    });
} catch (error) {
  core.setFailed(error.message);
}

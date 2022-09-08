import core from "@actions/core";
import github from "@actions/github";

import fetch, { Headers } from "node-fetch";
import base64 from "base-64";

try {
  const username = core.getInput("username");
  const password = core.getInput("password");
  const status = core.getInput("status");

  const headers = new Headers();

  headers.append(
    "Authorization",
    "Basic " + base64.encode(username + ":" + password)
  );

  fetch(
    `https://reynald-nova.atlassian.net/rest/api/2/search?jql=status='${status}'`,
    {
      method: "GET",
      headers: headers,
    }
  )
    .then((response) => response.json())
    .then((json) => console.log(JSON.stringify(json, null, 2)));

  const time = new Date().toTimeString();
  core.setOutput("time", time);
  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(github.context.payload, undefined, 2);
  console.log(`The event payload: ${payload}`);
} catch (error) {
  core.setFailed(error.message);
}

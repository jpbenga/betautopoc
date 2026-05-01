# Tool search

import {
  hostedToolSearchExample,
  hostedToolSearchResponse,
  clientToolSearchExample,
  clientToolSearchFirstResponse,
  clientToolSearchFollowUp,
  clientToolSearchLoadedFunctionCall,
} from "./tool-search-examples";

Tool search allows the model to dynamically search for and load tools into the model's context as needed. This allows you to avoid loading all tool definitions into the model's context up front and **may help reduce overall token usage and cost**. For optimal cost and latency, tool search is designed to **preserve the model’s cache**. When new tools are discovered by the model, they are injected at the end of the context window.

Only `gpt-5.4` and later models support `tool_search`.

To activate tool search, you must do two things:

1. Add `tool_search` as a tool in your `tools` array.
2. If you are using [functions](https://developers.openai.com/api/docs/guides/function-calling#defining-functions), mark the ones you want to defer with `defer_loading: true`. If you are using [MCP servers](https://developers.openai.com/api/docs/guides/tools-connectors-mcp), set `defer_loading: true` on the MCP server tool definition.

### Use namespaces where possible

You can use tool search with deferred [functions](https://developers.openai.com/api/docs/guides/function-calling#defining-functions), [namespaces](https://developers.openai.com/api/docs/guides/function-calling#defining-namespaces), or [MCP servers](https://developers.openai.com/api/docs/guides/tools-connectors-mcp), but we recommend using namespaces or MCP servers when possible. Our models have primarily been trained to search those surfaces, and token savings are usually more material there.

For namespaces, `defer_loading` applies to the functions inside the namespace, not to the namespace object itself.

At the start of a request, the model still sees the name and description of whatever is searchable. For a namespace or MCP server, that means the model sees only the namespace or server name and description at the beginning, without showing details of the individual functions contained within it until the tool search tool loads them. For an individual deferred function, the model still sees the function name and description, so in practice tool search is mostly deferring the parameter schema.

For maximum token savings, we recommend grouping deferred functions into namespaces or MCP servers with clear, high-level descriptions that give the model a strong overview of what is contained within them, so it can effectively search and load only the relevant functions. As a best practice, aim to keep each namespace to fewer than 10 functions for better token efficiency and model performance.

Namespaces can have a mix of tools that are deferred and not deferred. Tools without `defer_loading: true` are callable immediately, while deferred tools in the same namespace are loaded through tool search.

### Tool search types

There are two ways to use tool search:

- **Hosted tool search:** OpenAI searches across the deferred tools you declared in the request and returns the loaded subset in the same response.
- **Client-executed tool search:** The model emits a `tool_search_call`, your application performs the lookup, and you return a matching `tool_search_output`.

Start with hosted tool search if the candidate tools are already known when
  you create the request. Use client-executed tool search when tool discovery
  depends on project state, tenant state, or another system your application
  controls.

## Hosted tool search

Hosted tool search is the simplest path when you already know the full inventory of [functions](https://developers.openai.com/api/docs/guides/function-calling#defining-functions), [namespaces](https://developers.openai.com/api/docs/guides/function-calling#defining-namespaces), or [MCP servers](https://developers.openai.com/api/docs/guides/tools-connectors-mcp) you want the model to search. You declare them up front, add `{"type": "tool_search"}`, and let the API decide what to load.

If the model decides it needs a deferred tool, the response includes two additional output items before the eventual function call:

- `tool_search_call`, which records the hosted search step.
- `tool_search_output`, which contains the loaded subset that becomes callable.

In hosted mode, `execution` is set to `server` and `call_id` is set to `null`.

For more complex tasks, the model can also load multiple namespaces or MCP servers in the same `tool_search_call`. For example, if it needs functions from different namespaces to complete one task, it may choose to search and load those surfaces together before making the subsequent function calls.

## Client-executed tool search

Client-executed tool search gives your application full control over how tool discovery works. This is useful when the available tools depend on information that is not practical to declare in the initial `tools` list.

Configure the `tool_search` tool with `execution: "client"` and a schema for the search arguments your application expects:

On the first turn, the model emits a `tool_search_call` and stops there:

Your application then performs the search and returns a `tool_search_output` with the tools it wants to load:

On the next turn, the loaded tool is callable like a normal function:

In client mode, `execution` is set to `client` and `call_id` is defined. Echo the same `call_id` from the `tool_search_call` in your `tool_search_output`.

## Advanced usage

### Keep namespace descriptions clear

Make namespace descriptions clear and descriptive of the use case, because the model relies on this description to decide when to load a subset of functions in that namespace. Avoid overly long descriptions. Instead, put richer detail in the deferred function descriptions that are loaded only when needed.

### Understand what gets loaded

`tool_search_output.tools` contains the list of tools that were dynamically loaded by the model. The model will be able to call any of these tools in future turns, so in client mode you do not need to load the same tool again across turns. Tools that were not listed as part of this array will not be available to the model. If you want to disable a loaded tool, you can remove it from the `tool_search_output` item where you define the loaded tool set, but note that changing the loaded tool set will break the model's cache from that point forward.

### Advanced injection patterns

Most integrations declare tools in the request's `tools` parameter. Client-executed tool search also supports more advanced patterns where your application returns tools that were not present in the original request. Treat this as an advanced workflow: validate the returned schemas carefully and only expose trusted tool definitions.

### Tool search and caching

All tools are loaded at the end of the model's context window. This holds true for both hosted tool search and client-executed tool search. This allows the model's cache to be preserved from one request to another, lowering overall costs and boosting speed.

## Related guides

- Use [function calling](https://developers.openai.com/api/docs/guides/function-calling) to define callable functions and custom tools.
- Use [Using tools](https://developers.openai.com/api/docs/guides/tools) for the broader tool landscape across Responses.

# Rate limits

export const snippetTenacityLibrary = {
  python: `
from openai import OpenAI
client = OpenAI()

from tenacity import (
retry,
stop_after_attempt,
wait_random_exponential,
) # for exponential backoff

@retry(wait=wait_random_exponential(min=1, max=60), stop=stop_after_attempt(6))
def completion_with_backoff(**kwargs):
return client.completions.create(**kwargs)

completion_with_backoff(model="gpt-4o-mini", prompt="Once upon a time,")
`.trim(),
};

export const snippetBackoffLibrary = {
  python: `
import backoff
import openai
from openai import OpenAI
client = OpenAI()

@backoff.on_exception(backoff.expo, openai.RateLimitError)
def completions_with_backoff(**kwargs):
return client.completions.create(**kwargs)

completions_with_backoff(model="gpt-4o-mini", prompt="Once upon a time,")
`.trim(),
};

export const snippetManualBackoffImplementation = {
  python: `
# imports
import random
import time

import openai
from openai import OpenAI
client = OpenAI()

# define a retry decorator

def retry_with_exponential_backoff(
func,
initial_delay: float = 1,
exponential_base: float = 2,
jitter: bool = True,
max_retries: int = 10,
errors: tuple = (openai.RateLimitError,),
):
"""Retry a function with exponential backoff."""

    def wrapper(*args, **kwargs):
        # Initialize variables
        num_retries = 0
        delay = initial_delay

        # Loop until a successful response or max_retries is hit or an exception is raised
        while True:
            try:
                return func(*args, **kwargs)

            # Retry on specific errors
            except errors as e:
                # Increment retries
                num_retries += 1

                # Check if max retries has been reached
                if num_retries > max_retries:
                    raise Exception(
                        f"Maximum number of retries ({max_retries}) exceeded."
                    )

                # Increment the delay
                delay *= exponential_base * (1 + jitter * random.random())

                # Sleep for the delay
                time.sleep(delay)

            # Raise exceptions for any errors not specified
            except Exception as e:
                raise e

    return wrapper

@retry_with_exponential_backoff
def completions_with_backoff(**kwargs):
return client.completions.create(**kwargs)
`.trim(),
};

Rate limits are restrictions that our API imposes on the number of times a user or client can
access our services within a specified period of time.

## Why do we have rate limits?

Rate limits are a common practice for APIs, and they're put in place for a few different reasons:

- **They help protect against abuse or misuse of the API.** For example, a malicious actor could flood the API with requests in an attempt to overload it or cause disruptions in service. By setting rate limits, OpenAI can prevent this kind of activity.
- **Rate limits help ensure that everyone has fair access to the API.** If one person or organization makes an excessive number of requests, it could bog down the API for everyone else. By throttling the number of requests that a single user can make, OpenAI ensures that the most number of people have an opportunity to use the API without experiencing slowdowns.
- **Rate limits can help OpenAI manage the aggregate load on its infrastructure.** If requests to the API increase dramatically, it could tax the servers and cause performance issues. By setting rate limits, OpenAI can help maintain a smooth and consistent experience for all users.

Please work through this document in its entirety to better understand how
  OpenAI’s rate limit system works. We include code examples and possible
  solutions to handle common issues. We also include details around how your
  rate limits are automatically increased in the usage tiers section below.

## How do these rate limits work?

Rate limits are measured in five ways: **RPM** (requests per minute), **RPD** (requests per day), **TPM** (tokens per minute), **TPD** (tokens per day), and **IPM** (images per minute). Rate limits can be hit across any of the options depending on what occurs first. For example, you might send 20 requests with only 100 tokens to the ChatCompletions endpoint and that would fill your limit (if your RPM was 20), even if you did not send 150k tokens (if your TPM limit was 150k) within those 20 requests.

[Batch API](https://developers.openai.com/api/docs/api-reference/batch/create) queue limits are calculated based on the total number of input tokens queued for a given model. Tokens from pending batch jobs are counted against your queue limit. Once a batch job is completed, its tokens are no longer counted against that model's limit.

Other important things worth noting:

- Rate limits are defined at the [organization level](https://developers.openai.com/api/docs/guides/production-best-practices) and at the project level, not user level.
- Rate limits vary by the [model](https://developers.openai.com/api/docs/models) being used.
- For long context models like GPT-4.1, there is a separate rate limit for long context requests. You can view these rate limits in [developer console](https://platform.openai.com/settings/organization/limits).
- Limits are also placed on the total amount an organization can spend on the API each month. These are also known as "usage limits".
- Some model families have shared rate limits. Any models listed under a "shared limit" in your [organizations limit page](https://platform.openai.com/settings/organization/limits) share a rate limit between them. For example, if the listed shared TPM is 3.5M, all calls to any model in the given "shared limit" list will count towards that 3.5M.
- Vector store ingestion is also rate limited per vector store ID. `/vector_stores/{vector_store_id}/files` and `/vector_stores/{vector_store_id}/file_batches` share a limit of 300 requests per minute for each vector store. For larger ingests, prefer `/vector_stores/{vector_store_id}/file_batches`.

## Usage tiers

You can view the rate and usage limits for your organization under the [limits](https://platform.openai.com/settings/organization/limits) section of your account settings. As your spend on our API goes up, we automatically graduate you to the next usage tier. This usually results in an increase in rate limits across most models.

| Tier        | Qualification                                                         | Usage limits     |
| ----------- | --------------------------------------------------------------------- | ---------------- |
| Free        | User must be in an [allowed geography](https://developers.openai.com/api/docs/supported-countries) | $100 / month     |
| Tier&nbsp;1 | $5 paid                                                               | $100 / month     |
| Tier&nbsp;2 | $50 paid and 7+ days since first successful payment                   | $500 / month     |
| Tier&nbsp;3 | $100 paid and 7+ days since first successful payment                  | $1,000 / month   |
| Tier&nbsp;4 | $250 paid and 14+ days since first successful payment                 | $5,000 / month   |
| Tier&nbsp;5 | $1,000 paid and 30+ days since first successful payment               | $200,000 / month |

To view a high-level summary of rate limits per model, visit the [models page](https://developers.openai.com/api/docs/models).

### Rate limits in headers

In addition to seeing your rate limit on your [account page](https://platform.openai.com/settings/organization/limits), you can also view important information about your rate limits such as the remaining requests, tokens, and other metadata in the headers of the HTTP response.

You can expect to see the following header fields:

| Field                          | Sample Value | Description                                                                           |
| ------------------------------ | ------------ | ------------------------------------------------------------------------------------- |
| x-ratelimit-limit-requests     | 60           | The maximum number of requests that are permitted before exhausting the rate limit.   |
| x-ratelimit-limit-tokens       | 150000       | The maximum number of tokens that are permitted before exhausting the rate limit.     |
| x-ratelimit-remaining-requests | 59           | The remaining number of requests that are permitted before exhausting the rate limit. |
| x-ratelimit-remaining-tokens   | 149984       | The remaining number of tokens that are permitted before exhausting the rate limit.   |
| x-ratelimit-reset-requests     | 1s           | The time until the rate limit (based on requests) resets to its initial state.        |
| x-ratelimit-reset-tokens       | 6m0s         | The time until the rate limit (based on tokens) resets to its initial state.          |

### Fine-tuning rate limits

The fine-tuning rate limits for your organization can be [found in the dashboard as well](https://platform.openai.com/settings/organization/limits), and can also be retrieved via API:

```bash
curl https://api.openai.com/v1/fine_tuning/model_limits \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

## Error mitigation

### What are some steps I can take to mitigate this?

The OpenAI Cookbook has a [Python notebook](https://developers.openai.com/cookbook/examples/how_to_handle_rate_limits) that explains how to avoid rate limit errors, as well an example [Python script](https://github.com/openai/openai-cookbook/blob/main/examples/api_request_parallel_processor.py) for staying under rate limits while batch processing API requests.

You should also exercise caution when providing programmatic access, bulk processing features, and automated social media posting - consider only enabling these for trusted customers.

To protect against automated and high-volume misuse, set a usage limit for individual users within a specified time frame (daily, weekly, or monthly). Consider implementing a hard cap or a manual review process for users who exceed the limit.

#### Retrying with exponential backoff

One easy way to avoid rate limit errors is to automatically retry requests with a random exponential backoff. Retrying with exponential backoff means performing a short sleep when a rate limit error is hit, then retrying the unsuccessful request. If the request is still unsuccessful, the sleep length is increased and the process is repeated. This continues until the request is successful or until a maximum number of retries is reached.
This approach has many benefits:

- Automatic retries means you can recover from rate limit errors without crashes or missing data
- Exponential backoff means that your first retries can be tried quickly, while still benefiting from longer delays if your first few retries fail
- Adding random jitter to the delay helps retries from all hitting at the same time.

Note that unsuccessful requests contribute to your per-minute limit, so continuously resending a request won’t work.

Below are a few example solutions **for Python** that use exponential backoff.

Example 1: Using the Tenacity library

Tenacity is an Apache 2.0 licensed general-purpose retrying library, written in Python, to simplify the task of adding retry behavior to just about anything.
To add exponential backoff to your requests, you can use the `tenacity.retry` decorator. The below example uses the `tenacity.wait_random_exponential` function to add random exponential backoff to a request.

Note that the Tenacity library is a third-party tool, and OpenAI makes no guarantees about
its reliability or security.

Example 2: Using the backoff library

Another python library that provides function decorators for backoff and retry is [backoff](https://pypi.org/project/backoff/):

Like Tenacity, the backoff library is a third-party tool, and OpenAI makes no guarantees about its reliability or security.

Example 3: Manual backoff implementation

If you don't want to use third-party libraries, you can implement your own backoff logic following this example:
Again, OpenAI makes no guarantees on the security or efficiency of this solution but it can be a good starting place for your own solution.

#### Reduce the `max_tokens` to match the size of your completions

Your rate limit is calculated as the maximum of `max_tokens` and the estimated number of tokens based on the character count of your request. Try to set the `max_tokens` value as close to your expected response size as possible.

#### Batching requests

If your use case does not require immediate responses, you can use the [Batch API](https://developers.openai.com/api/docs/guides/batch) to more easily submit and execute large collections of requests without impacting your synchronous request rate limits.

For use cases that _do_ requires synchronous responses, the OpenAI API has separate limits for **requests per minute** and **tokens per minute**.

If you're hitting the limit on requests per minute but have available capacity on tokens per minute, you can increase your throughput by batching multiple tasks into each request. This will allow you to process more tokens per minute, especially with our smaller models.

Sending in a batch of prompts works exactly the same as a normal API call, except you pass in a list of strings to the prompt parameter instead of a single string. [Learn more in the Batch API guide](https://developers.openai.com/api/docs/guides/batch).

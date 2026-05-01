# Compaction

## Overview

To support long-running interactions, you can use compaction to reduce context
size while preserving state needed for subsequent turns.

Compaction helps you balance quality, cost, and latency as conversations grow.

## Server-side compaction

You can enable server-side compaction in a Responses create request
(`POST /responses` or `client.responses.create`) by setting
`context_management` with `compact_threshold`.

- When the rendered token count crosses the configured threshold, the server
  runs server-side compaction.
- No separate `/responses/compact` call is required in this mode.
- The response stream includes the encrypted compaction item.
- ZDR note: server-side compaction is ZDR-friendly when you set `store=false`
  on your Responses create requests.

The returned compaction item carries forward key prior state and reasoning into
the next run using fewer tokens. It is opaque and not intended to be
human-interpretable.

For stateless input-array chaining, append output items as usual. If you are
using `previous_response_id`, pass only the new user message each turn. In both
cases, the compaction item carries context needed for the next window.

Latency tip: After appending output items to the previous input items, you can
drop items that came before the most recent compaction item to keep requests
smaller and reduce long-tail latency. The latest compaction item carries the
necessary context to continue the conversation. If you use
`previous_response_id` chaining, do not manually prune.

## User journey

1. Call `/responses` as usual, but include `context_management` with
   `compact_threshold` to enable server-side compaction.
2. As the response streams, if the context size crosses the threshold, the server
   triggers a compaction pass, emits a compaction output item in the same stream,
   and prunes context before continuing inference.
3. Continue your loop with one pattern: stateless input-array chaining (append
   output, including compaction items, to your next input array) or
   `previous_response_id` chaining (pass only the new user message each turn and
   carry that ID forward).

<a id="server-side-compaction-user-flow"></a>

## Example user flow

```python
conversation = [
    {
        "type": "message",
        "role": "user",
        "content": "Let's begin a long coding task.",
    }
]

while keep_going:
    response = client.responses.create(
        model="gpt-5.3-codex",
        input=conversation,
        store=False,
        context_management=[{"type": "compaction", "compact_threshold": 200000}],
    )

    conversation.extend(response.output)

    conversation.append(
        {
            "type": "message",
            "role": "user",
            "content": get_next_user_input(),
        }
    )
```

## Standalone compact endpoint

For explicit control, use the
[standalone compact endpoint](https://developers.openai.com/api/docs/api-reference/responses/compact) for
stateless compaction in long-running workflows.

This endpoint is fully stateless and ZDR-friendly.

You send a full context window (messages, tools, and other items), and the
endpoint returns a new compacted context window you can pass to your next
`/responses` call.

The returned compacted window includes an encrypted compaction item that carries
forward key prior state and reasoning using fewer tokens. It is opaque and not
intended to be human-interpretable.

Note: the compacted window generally contains more than just the compaction
item. It can also include retained items from the previous window.

Output handling: do not prune `/responses/compact` output. The returned window
is the canonical next context window, so pass it into your next `/responses`
call as-is.

### User journey for standalone compaction

1. Use `/responses` normally, sending input items that include user messages,
   assistant outputs, and tool interactions.
2. When your context window grows large, call `/responses/compact` to generate a
   new compacted context window. The window you send to `/responses/compact`
   must still fit within your model's context window.
3. For subsequent `/responses` calls, pass the returned compacted window
   (including the compaction item) as input instead of the full transcript.

<a id="standalone-compact-endpoint-user-flow"></a>

### Example user flow

```python
# Full window collected from prior turns
long_input_items_array = [...]

# 1) Compact the current window
compacted = client.responses.compact(
    model="gpt-5.5",
    input=long_input_items_array,
)

# 2) Start the next turn by appending a new user message
next_input = [
    *compacted.output,  # Use compact output as-is
    {
        "type": "message",
        "role": "user",
        "content": user_input_message(),
    },
]

next_response = client.responses.create(
    model="gpt-5.5",
    input=next_input,
    store=False,  # Keep the flow ZDR-friendly
)
```

# Counting tokens

Token counting lets you determine how many input tokens a request will use before you send it to the model. Use it to:

- **Optimize prompts** to fit within context limits
- **Estimate costs** before making API calls
- **Route requests** based on size (e.g., smaller prompts to faster models)
- **Avoid surprises** with images and files—no more character-based estimation

The [input token count endpoint](https://developers.openai.com/api/reference/python/resources/responses/subresources/input_tokens/methods/count) accepts the same input format as the [Responses API](https://developers.openai.com/api/docs/api-reference/responses/create). Pass text, messages, images, files, tools, or conversations—the API returns the exact count the model will receive.

## Why use the token counting API?

Local tokenizers like [tiktoken](https://github.com/openai/tiktoken) work for plain text, but they have limitations:

- **Images and files** are not supported—estimates like `characters / 4` are inaccurate
- **Tools and schemas** add tokens that are hard to count locally
- **Model-specific behavior** can change tokenization (e.g., reasoning, caching)

The token counting API handles all of these. Use the same payload you would send to `responses.create` and get an accurate count. Then plug the result into your message validation or cost estimation flow.

## Count tokens in basic messages

## Count tokens in conversations

## Count tokens with instructions

## Count tokens with images

Images consume tokens based on size and detail level. The token counting API returns the exact count—no guesswork.

You can use `file_id` (from the [Files API](https://developers.openai.com/api/docs/api-reference/files)) or `image_url` (a URL or base64 data URL). See [images and vision](https://developers.openai.com/api/docs/guides/images-vision) for details.

## Count tokens with tools

Tool definitions (function schemas, MCP servers, etc.) add tokens to the context. Count them together with your input:

## Count tokens with files

[File inputs](https://developers.openai.com/api/docs/guides/pdf-files)—currently PDFs—are supported. Pass `file_id`, `file_url`, or `file_data` as you would for `responses.create`. The token count reflects the model’s full processed input.

## API reference

For full parameters and response shape, see the [Count input tokens API reference](https://developers.openai.com/api/reference/python/resources/responses/subresources/input_tokens/methods/count). The endpoint is:

```
POST /v1/responses/input_tokens
```

The response includes `input_tokens` (integer) and `object: "response.input_tokens"`.

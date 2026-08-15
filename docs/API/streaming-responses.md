---
id: streaming-responses
title: Stream API Responses
sidebar_label: Streaming Responses
sidebar_position: 3
description: Learn how to stream responses from the API in real time using server-sent events, handle partial output, and manage errors mid-stream.
---

# Stream API Responses

By default, the API returns a complete response only after generation finishes. For long responses, this can mean waiting several seconds with no feedback. **Streaming** sends the response incrementally, as a series of small events, so your application can display output as it's generated.

Use streaming when:
- You're building a chat or assistant-style interface and want to show output token-by-token
- Response generation may take more than 2–3 seconds
- You need to cancel generation early based on partial output

Use the standard (non-streaming) endpoint when your application only needs the final result and doesn't display output incrementally — it's simpler to implement and easier to retry on failure.

## Prerequisites

- An API key (get one here)
- Familiarity with [Server-Sent Events (SSE)](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events) — the client libraries below handle SSE parsing for you, but it helps to know the underlying format if you're debugging
- SDK version 2.4.0 or later (streaming was added in 2.4.0; check with `pip show your-sdk`)

## Enable streaming

Set `stream: true` in your request. The response body changes from a single JSON object to a sequence of events, each prefixed with `data:`.

```python
from your_sdk import Client

client = Client(api_key="YOUR_API_KEY")

stream = client.messages.create(
    model="model-large",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Explain streaming in one paragraph."}],
    stream=True,
)

for event in stream:
    if event.type == "content_block_delta":
        print(event.delta.text, end="", flush=True)
```

```javascript
const stream = await client.messages.create({
  model: "model-large",
  max_tokens: 1024,
  messages: [{ role: "user", content: "Explain streaming in one paragraph." }],
  stream: true,
});

for await (const event of stream) {
  if (event.type === "content_block_delta") {
    process.stdout.write(event.delta.text);
  }
}
```

## Event types

A stream is a sequence of typed events, not just raw text chunks. Handling each type explicitly makes your integration more robust than assuming every event carries text.

| Event type | When it fires | What to do with it |
|---|---|---|
| `message_start` | Once, at the beginning | Initialize any UI state (e.g., show a typing indicator) |
| `content_block_delta` | Repeatedly, as text is generated | Append `delta.text` to your output buffer |
| `content_block_stop` | Once per content block | Finalize that block (useful if a response has multiple blocks) |
| `message_delta` | Near the end | Contains usage/stop-reason metadata |
| `message_stop` | Once, at the end | Close out the UI state; the stream is complete |
| `error` | Any time | Stop reading and surface the error — see below |

## Handling errors mid-stream

Because a stream can fail *after* it has already sent partial content, don't wait for a full response before handling errors — check for an `error` event on every iteration:

```python
try:
    for event in stream:
        if event.type == "error":
            handle_error(event.error)
            break
        if event.type == "content_block_delta":
            print(event.delta.text, end="")
except ConnectionError:
    # Network drop mid-stream: safe to retry the whole request
    retry_request()
```

| Symptom | Likely cause | Fix |
|---|---|---|
| Stream ends with no `message_stop` | Connection dropped | Retry the full request; streaming responses aren't resumable mid-stream |
| `error` event with `overloaded_error` | Server at capacity | Retry with exponential backoff |
| Garbled or partial JSON when parsing manually | SSE frames split across TCP packets | Use the SDK's built-in parser rather than parsing raw bytes yourself |

## Next steps

- [Handling rate limits] — streaming requests are rate-limited the same as standard requests
- [Error reference] — full list of error types and recommended handling
- [Building a chat interface] — a worked example that combines streaming with conversation history

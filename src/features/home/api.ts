export type ChatStreamRq = {
  message: string
  model: string
  sessionId: string
}

type ChatStreamDelta = {
  content?: string
  role?: string
}

type ChatStreamChoice = {
  delta?: ChatStreamDelta
  finish_reason?: string | null
  index: number
}

export type ChatStreamRs = {
  choices?: ChatStreamChoice[]
  created?: number
  id?: string
  model?: string
  object?: string
  system_fingerprint?: string
}

type ChatStreamErrorRs = {
  error?: string
}

const CHAT_STREAM_URL = import.meta.env.VITE_CHAT_STREAM_URL?.trim()
const CHAT_API_KEY = import.meta.env.VITE_CHAT_API_KEY?.trim()
const CHAT_MODEL = import.meta.env.VITE_CHAT_MODEL?.trim()

function getChatStreamConfig() {
  if (!CHAT_STREAM_URL) {
    throw new Error('Missing VITE_CHAT_STREAM_URL')
  }

  if (!CHAT_API_KEY) {
    throw new Error('Missing VITE_CHAT_API_KEY')
  }

  if (!CHAT_MODEL) {
    throw new Error('Missing VITE_CHAT_MODEL')
  }

  return {
    apiKey: CHAT_API_KEY,
    model: CHAT_MODEL,
    url: CHAT_STREAM_URL,
  }
}

export function createChatStreamRequest(message: string, sessionId: string): ChatStreamRq {
  const { model } = getChatStreamConfig()

  return {
    message,
    model,
    sessionId,
  }
}

async function buildError(response: Response) {
  const bodyText = await response.text()

  if (!bodyText) {
    return new Error(`Chat stream request failed with status ${response.status}`)
  }

  try {
    const payload = JSON.parse(bodyText) as ChatStreamErrorRs
    if (payload.error) {
      return new Error(payload.error)
    }
  } catch {
    return new Error(bodyText)
  }

  return new Error(`Chat stream request failed with status ${response.status}`)
}

function parseStreamPayload(data: string) {
  if (data === '[DONE]') {
    return { done: true as const }
  }

  const payload = JSON.parse(data) as ChatStreamRs & ChatStreamErrorRs

  if (payload.error) {
    throw new Error(payload.error)
  }

  return {
    chunk: payload,
    done: false as const,
  }
}

function extractChunkContent(payload: ChatStreamRs) {
  return payload.choices?.map((choice) => choice.delta?.content ?? '').join('') ?? ''
}

export async function* streamChatReply(payload: ChatStreamRq): AsyncGenerator<string, void, void> {
  const { apiKey, url } = getChatStreamConfig()
  const requestUrl = new URL(url, window.location.origin)

  requestUrl.searchParams.set('message', payload.message)
  requestUrl.searchParams.set('session_id', payload.sessionId)
  requestUrl.searchParams.set('model', payload.model)

  const response = await fetch(requestUrl.toString(), {
    headers: {
      'X-Chat-Api-Key': apiKey,
    },
    method: 'GET',
  })

  if (!response.ok) {
    throw await buildError(response)
  }

  if (!response.body) {
    throw new Error('Chat stream response body is empty')
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  let fullReply = ''
  let hasReceivedStreamData = false

  while (true) {
    const { done, value } = await reader.read()
    buffer += decoder.decode(value ?? new Uint8Array(), { stream: !done })

    let newlineIndex = buffer.indexOf('\n')

    while (newlineIndex >= 0) {
      const line = buffer.slice(0, newlineIndex).replace(/\r$/, '')
      buffer = buffer.slice(newlineIndex + 1)

      if (!line) {
        newlineIndex = buffer.indexOf('\n')
        continue
      }

      if (!line.startsWith('data:')) {
        throw new Error('Invalid SSE payload received from chat stream API')
      }

      hasReceivedStreamData = true

      const data = line.slice(5).trim()
      const parsed = parseStreamPayload(data)

      if (parsed.done) {
        return
      }

      const nextContent = extractChunkContent(parsed.chunk)
      if (nextContent) {
        fullReply += nextContent
        yield fullReply
      }

      newlineIndex = buffer.indexOf('\n')
    }

    if (done) {
      break
    }
  }

  if (buffer.trim()) {
    if (!buffer.trim().startsWith('data:')) {
      throw new Error('Invalid SSE payload received from chat stream API')
    }

    hasReceivedStreamData = true

    const parsed = parseStreamPayload(buffer.trim().slice(5).trim())
    if (!parsed.done) {
      const nextContent = extractChunkContent(parsed.chunk)
      if (nextContent) {
        fullReply += nextContent
        yield fullReply
      }
    }
  }

  if (!hasReceivedStreamData) {
    throw new Error('Chat stream API did not return SSE data')
  }
}

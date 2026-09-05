interface ChatMessage {
  role: 'system' | 'user';
  content: string;
}

interface OpenRouterChatResponse {
  choices?: Array<{ message?: { content?: string } }>;
}

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const DEFAULT_MODEL = 'openai/gpt-oss-20b:free';

/** Calls an OpenRouter chat model and parses its response as JSON, retrying once on a bad response. */
export async function callOpenRouterJSON<T>(messages: ChatMessage[]): Promise<T> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY is not set on the server. Add it to server/.env.');
  }
  const model = process.env.OPENROUTER_MODEL || DEFAULT_MODEL;

  let lastError: unknown;

  // Try once with response_format (JSON mode), then once without — some free
  // models on OpenRouter don't support the parameter and reject the request.
  for (const useJsonMode of [true, false]) {
    try {
      const response = await fetch(OPENROUTER_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://resumeforge.local',
          'X-Title': 'ResumeForge AI',
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: 0.4,
          ...(useJsonMode ? { response_format: { type: 'json_object' } } : {}),
        }),
      });

      if (!response.ok) {
        const body = await response.text().catch(() => '');
        throw new Error(`OpenRouter request failed (${response.status}): ${body.slice(0, 500)}`);
      }

      const payload = (await response.json()) as OpenRouterChatResponse;
      const content = payload?.choices?.[0]?.message?.content;
      if (!content) {
        throw new Error('OpenRouter returned an empty response.');
      }

      return parseJsonLoose<T>(content);
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError instanceof Error ? lastError : new Error('Failed to get a valid JSON response from the model.');
}

/** Extracts and parses a JSON object from a model response, tolerating markdown code fences and stray prose. */
function parseJsonLoose<T>(raw: string): T {
  const cleaned = raw
    .trim()
    .replace(/^```(?:json)?/i, '')
    .replace(/```$/, '')
    .trim();

  try {
    return JSON.parse(cleaned) as T;
  } catch {
    const start = cleaned.indexOf('{');
    const end = cleaned.lastIndexOf('}');
    if (start === -1 || end === -1 || end <= start) {
      throw new Error('Model response was not valid JSON.');
    }
    return JSON.parse(cleaned.slice(start, end + 1)) as T;
  }
}

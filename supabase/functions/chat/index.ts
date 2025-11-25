const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const LLM_URLS = {
  openai: 'https://api.supermemory.ai/v3/https://api.openai.com/v1/',
  anthropic: 'https://api.supermemory.ai/v3/https://api.anthropic.com/v1/',
  gemini: 'https://api.supermemory.ai/v3/https://generativelanguage.googleapis.com/v1beta/openai/',
  groq: 'https://api.supermemory.ai/v3/https://api.groq.com/openai/v1',
};

const DEFAULT_MODELS = {
  openai: 'gpt-4o-mini',
  anthropic: 'claude-3-5-sonnet-20241022',
  gemini: 'gemini-pro',
  groq: 'mixtral-8x7b-32768',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, userId, provider, apiKey, supermemoryKey } = await req.json();

    console.log('Received chat request for user:', userId, 'with provider:', provider);

    if (!apiKey || !supermemoryKey) {
      console.error('Missing API keys');
      return new Response(
        JSON.stringify({ error: 'API keys not provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!LLM_URLS[provider as keyof typeof LLM_URLS]) {
      console.error('Invalid provider:', provider);
      return new Response(
        JSON.stringify({ error: 'Invalid provider' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const baseUrl = LLM_URLS[provider as keyof typeof LLM_URLS];
    const model = DEFAULT_MODELS[provider as keyof typeof DEFAULT_MODELS];
    const endpoint = `${baseUrl}chat/completions`;

    console.log(`Calling ${provider} through Supermemory...`);

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'x-supermemory-api-key': supermemoryKey,
        'x-sm-user-id': userId,
      },
      body: JSON.stringify({
        model: model,
        messages: messages,
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`${provider} API error:`, response.status, errorText);
      return new Response(
        JSON.stringify({ error: `${provider} API error: ${response.status}` }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    console.log(`Successfully received response from ${provider}`);

    return new Response(
      JSON.stringify(data),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in chat function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

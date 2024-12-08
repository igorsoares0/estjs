export async function addOpenAIFunctionality(editor, apiKey) {
    const openAIButton = document.createElement('button');
    openAIButton.title = 'Generate Text with OpenAI';
    openAIButton.textContent = 'AI ✨';
  
    openAIButton.addEventListener('click', async () => {
      const prompt = prompt('Enter a prompt for the AI: ');
      if (!prompt) return;
  
      try {
        const generatedText = await generateChatCompletion(prompt, apiKey);
        if (generatedText) {
          editor.insertText(generatedText);
        }
      } catch (error) {
        console.error('Error generating text:', error);
        alert('Failed to generate text. Please try again.');
      }
    });
  
    // Add button to toolbar
    editor.toolbar.appendChild(openAIButton);
  }
  
  // Call openAI api (/v1/chat/completions)
  async function generateChatCompletion(prompt, apiKey) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4', // 'gpt-3.5-turbo' 
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: prompt },
        ],
        max_tokens: 200, 
        temperature: 0.7,
      }),
    });
  
    if (!response.ok) {
      throw new Error(`OpenAI API returned an error: ${response.statusText}`);
    }
  
    const data = await response.json();
    return data.choices[0]?.message?.content.trim();
  }
  
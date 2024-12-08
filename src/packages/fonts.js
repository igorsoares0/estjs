export function addFontFunctionality(editor) {
    const fontSelector = document.createElement('select');
    fontSelector.title = 'Select Font';
  
    // Fonts list
    const fonts = [
      { name: 'Default', value: '' },
      { name: 'Poppins', value: 'Poppins, sans-serif' },
      { name: 'Inter', value: 'Inter, sans-serif' },
      { name: 'Georgia', value: 'Georgia, serif' },
      { name: 'Roboto', value: 'Roboto, sans-serif' },
    ];
  
    // Add options
    fonts.forEach(font => {
      const option = document.createElement('option');
      option.textContent = font.name;
      option.value = font.value;
      fontSelector.appendChild(option);
    });
  
    // Add selected font
    fontSelector.addEventListener('change', (e) => {
      const selectedFont = e.target.value;
      if (selectedFont) {
        editor.applyStyleToSelection('font-family', selectedFont);
      }
    });
  
    // Add font selector to toolbar
    editor.toolbar.appendChild(fontSelector);
  
    // Load fonts via Google Fonts
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&family=Inter:wght@400;700&family=Roboto:wght@400;700&display=swap';
    document.head.appendChild(link);
  }
  
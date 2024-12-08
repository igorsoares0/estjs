export function addHighlightFunctionality(editor) {
    const highlightPicker = document.createElement('input');
    highlightPicker.type = 'color';
    highlightPicker.title = 'Highlight Text';
  
    highlightPicker.addEventListener('input', (e) => {
      editor.formatDocument('backColor', e.target.value);
    });
  
    // Add color picker to toolbar
    editor.toolbar.appendChild(highlightPicker);
  }
  
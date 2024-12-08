export function addTextColorFunctionality(editor) {
    const colorPicker = document.createElement('input');
    colorPicker.type = 'color';
    colorPicker.title = 'Change Text Color';
    
    colorPicker.addEventListener('input', (e) => {
      editor.formatDocument('foreColor', e.target.value);
    });
  
    
    editor.toolbar.appendChild(colorPicker);
  }
  
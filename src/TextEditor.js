class TextEditor {
    constructor(options = {}) {
      // Default configuration
      this.config = {
        container: options.container || document.body,
        initialContent: options.initialContent || '',
        allowedFormats: options.allowedFormats || [
          'bold', 'italic', 'underline', 
          'createLink', 'heading1', 'heading2', 
          'fontSize', 'textColor', 'backgroundColor'
        ],
        enableTextColor: options.enableTextColor || false, 
        enableHighlight: options.enableHighlight || false, 
        enableFontSelection: options.enableFontSelection || false, 
        enableImageInsertion: options.enableImageInsertion || false, 
        enableOpenAI: options.enableOpenAI || false, 
        openAIApiKey: options.openAIApiKey || '', 
        enableCodeView: options.enableCodeView !== false,
        enableFileOperations: options.enableFileOperations !== false
      };
  
      // Create the editor
      this.initialize();
  
      if (this.config.enableTextColor) {
        import('./packages/color.js').then(({ addTextColorFunctionality }) => {
          addTextColorFunctionality(this);
        });
      }
    
      if (this.config.enableHighlight) {
        import('./packages/highlight.js').then(({ addHighlightFunctionality }) => {
          addHighlightFunctionality(this);
        });
      }
    
      if (this.config.enableFontSelection) {
        import('./packages/fonts.js').then(({ addFontFunctionality }) => {
          addFontFunctionality(this);
        });
      }
    
      if (this.config.enableImageInsertion) {
        import('./packages/images.js').then(({ addImageFunctionality }) => {
          addImageFunctionality(this);
        });
      }
    
      if (this.config.enableOpenAI && this.config.openAIApiKey) {
        import('./packages/openai.js').then(({ addOpenAIFunctionality }) => {
          addOpenAIFunctionality(this, this.config.openAIApiKey);
        });
      }
    }
  
    applyStyleToSelection(styleName, styleValue) {
      const selection = window.getSelection();
      if (!selection.rangeCount) return;
    
      const range = selection.getRangeAt(0);
      const span = document.createElement('span');
      span.style[styleName] = styleValue;
    
      range.surroundContents(span);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  
    insertImage(imageUrl) {
      const img = document.createElement('img');
      img.src = imageUrl;
      img.style.maxWidth = '100%'; 
      img.alt = 'Inserted Image';
    
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.deleteContents();
        range.insertNode(img);
      } else {
        this.contentArea.appendChild(img); 
      }
    }
  
    insertText(text) {
      const selection = window.getSelection();
      const range = selection.rangeCount ? selection.getRangeAt(0) : null;
    
      if (range) {
        range.deleteContents();
        range.insertNode(document.createTextNode(text));
      } else {
        this.contentArea.appendChild(document.createTextNode(text));
      }
    }
    
    initialize() {
      // Create main container
      this.editorContainer = document.createElement('div');
      this.editorContainer.className = 'text-editor-container';
      
      // Create toolbar
      this.toolbar = this.createToolbar();
      
      // Create content area
      this.contentArea = this.createContentArea();
      
      // Append to main container
      this.editorContainer.appendChild(this.toolbar);
      this.editorContainer.appendChild(this.contentArea);
      
      // Append to parent container
      this.config.container.appendChild(this.editorContainer);
  
      // Set initial content
      this.setContent(this.config.initialContent);
  
      // Setup event listeners
      this.setupEventListeners();
    }
  
    createToolbar() {
      const toolbar = document.createElement('div');
      toolbar.className = 'text-editor-toolbar';
  
      // Filename input
      const filenameInput = document.createElement('input');
      filenameInput.type = 'text';
      filenameInput.value = 'untitled';
      filenameInput.className = 'filename-input';
  
      // Toolbar buttons
      const buttons = [
        { name: 'Bold', command: 'bold', icon: 'B' },
        { name: 'Italic', command: 'italic', icon: 'I' },
        { name: 'Underline', command: 'underline', icon: 'U' },
        { name: 'Link', command: 'link', icon: '🔗' },
        { name: 'Heading 1', command: 'heading1', icon: 'H1' },
        { name: 'Heading 2', command: 'heading2', icon: 'H2' }
      ];
  
      // Create buttons dynamically
      buttons.forEach(btn => {
        const button = document.createElement('button');
        button.textContent = btn.icon;
        button.title = btn.name;
        button.addEventListener('click', () => this.formatDocument(btn.command));
        toolbar.appendChild(button);
      });
  
      // File operations
      if (this.config.enableFileOperations) {
        const fileOperations = [
          { name: 'New', value: 'new' },
          { name: 'Save as TXT', value: 'txt' },
          { name: 'Save as PDF', value: 'pdf' }
        ];
  
        const fileSelect = document.createElement('select');
        fileSelect.addEventListener('change', (e) => {
          this.handleFileOperation(e.target.value);
          e.target.selectedIndex = 0; // Reset selection
        });
  
        const defaultOption = document.createElement('option');
        defaultOption.textContent = 'File Operations';
        defaultOption.selected = true;
        defaultOption.disabled = true;
        fileSelect.appendChild(defaultOption);
  
        fileOperations.forEach(op => {
          const option = document.createElement('option');
          option.value = op.value;
          option.textContent = op.name;
          fileSelect.appendChild(option);
        });
  
        toolbar.appendChild(fileSelect);
      }
  
      // Code view toggle
      if (this.config.enableCodeView) {
        const codeViewBtn = document.createElement('button');
        codeViewBtn.textContent = '{ }';
        codeViewBtn.title = 'Toggle Code View';
        codeViewBtn.addEventListener('click', () => this.toggleCodeView());
        toolbar.appendChild(codeViewBtn);
      }
  
      return toolbar;
    }
  
    createContentArea() {
      const content = document.createElement('div');
      content.id = 'content';
      content.contentEditable = 'true';
      content.spellcheck = 'false';
      return content;
    }
  
    formatDocument(command, value = null) {
      if (value) {
        document.execCommand(command, false, value);
      } else {
        document.execCommand(command);
      }
    }
  
    addLink() {
      const url = prompt('Insert URL');
      if (url) {
        this.formatDocument('createLink', url);
      }
    }
  
    setupEventListeners() {
      // Make links open in new tab and disable editing when hovering
      this.contentArea.addEventListener('mouseenter', () => {
        const links = this.contentArea.querySelectorAll('a');
        links.forEach(link => {
          link.addEventListener('mouseenter', () => {
            this.contentArea.contentEditable = 'false';
            link.target = '_blank';
          });
          link.addEventListener('mouseleave', () => {
            this.contentArea.contentEditable = 'true';
          });
        });
      });
    }
  
    toggleCodeView() {
      const isCodeView = this.contentArea.dataset.codeView === 'true';
      
      if (isCodeView) {
        // Switch back to HTML view
        this.contentArea.innerHTML = this.contentArea.textContent;
        this.contentArea.contentEditable = 'true';
        this.contentArea.dataset.codeView = 'false';
      } else {
        // Switch to code view
        this.contentArea.textContent = this.contentArea.innerHTML;
        this.contentArea.contentEditable = 'false';
        this.contentArea.dataset.codeView = 'true';
      }
    }
  
    handleFileOperation(operation) {
      switch(operation) {
        case 'new':
          this.contentArea.innerHTML = '';
          break;
        case 'txt':
          this.saveAsTextFile();
          break;
        case 'pdf':
          this.saveAsPdfFile();
          break;
      }
    }
  
    saveAsTextFile() {
      const blob = new Blob([this.contentArea.innerText], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${this.toolbar.querySelector('.filename-input').value}.txt`;
      link.click();
    }
  
    saveAsPdfFile() {
      // Note: This requires the html2pdf library to be included
      if (typeof html2pdf !== 'undefined') {
        html2pdf(this.contentArea).save(
          this.toolbar.querySelector('.filename-input').value
        );
      } else {
        console.error('html2pdf library not found');
      }
    }
  
    setContent(content) {
      this.contentArea.innerHTML = content;
    }
  
    getContent() {
      return this.contentArea.innerHTML;
    }
  
    destroy() {
      // Remove the editor from the DOM
      this.config.container.removeChild(this.editorContainer);
    }
  }
  
  // Export the library
  export default TextEditor;
  
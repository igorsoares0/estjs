import TextEditor from "./src/TextEditor.js"

// Inicialização do editor
document.addEventListener('DOMContentLoaded', () => {
    const editor = new TextEditor({
        container: document.getElementById('editor-container'),
        initialContent: 'Welcome to Writer JS!',
        enableCodeView: true,
        enableFileOperations: true,
        enableTextColor: true,
        enableHighlight: true,
        enableFontSelection: true,
        enableImageInsertion: true,
        enableOpenAI: true,
        openAIApiKey: "" // You need add your openaAI api key to show this feature  
    });
});

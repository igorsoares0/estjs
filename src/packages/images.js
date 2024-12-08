export function addImageFunctionality(editor) {
    const imageButton = document.createElement('button');
    imageButton.title = 'Add Image';
    imageButton.textContent = '🖼️'; // Image icon
  
    // Event to insert image
    imageButton.addEventListener('click', () => {
      const imageUrl = prompt('Enter image URL:');
      if (imageUrl) {
        editor.insertImage(imageUrl);
      }
    });
  
    // Add button to toolbar
    editor.toolbar.appendChild(imageButton);
  
    // Event to upload image
    const imageUploadInput = document.createElement('input');
    imageUploadInput.type = 'file';
    imageUploadInput.accept = 'image/*';
    imageUploadInput.style.display = 'none';
  
    imageUploadInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          editor.insertImage(event.target.result);
        };
        reader.readAsDataURL(file);
      }
    });
  
    // Button to image upload
    const uploadButton = document.createElement('button');
    uploadButton.title = 'Upload Image';
    uploadButton.textContent = '⬆️'; 
    uploadButton.addEventListener('click', () => imageUploadInput.click());
  
    // Add button to toolbar upload
    editor.toolbar.appendChild(uploadButton);
  }
  
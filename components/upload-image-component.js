import { uploadImage } from "../api.js";


export function renderUploadImageComponent({ element, onImageUrlChange }) {
  
  let imageUrl = "";

 
  const render = () => {
    element.innerHTML = `
      <div class="upload-image">
        ${
          imageUrl
            ? `
            <div class="file-upload-image-container">
              <img class="file-upload-image" src="${imageUrl}" alt="Загруженное изображение">
              <button class="file-upload-remove-button button">Заменить фото</button>
            </div>
            `
            : `
            <label class="file-upload-label secondary-button">
              <input
                type="file"
                class="file-upload-input"
                style="display:none"
              />
              Выберите фото
            </label>
          `
        }
      </div>
    `;

   
    const fileInputElement = element.querySelector(".file-upload-input");
    if (fileInputElement) {
      fileInputElement.addEventListener("change", () => {
        const file = fileInputElement.files[0];
        if (file) {
          const labelEl = element.querySelector(".file-upload-label");
          if (labelEl) {
            labelEl.setAttribute("disabled", true);
            labelEl.textContent = "Загружаю файл...";
          }
          
         
          uploadImage({ file })
            .then(({ imageUrl: fileUrl }) => { 
              imageUrl = fileUrl;
              if (typeof onImageUrlChange === 'function') { 
                onImageUrlChange(imageUrl); 
              }
              render(); 
            })
            .catch((error) => {
              console.error("Ошибка при загрузке изображения:", error);
              if (typeof onImageUrlChange === 'function') {
                onImageUrlChange(""); 
              }
             
              const labelEl = element.querySelector(".file-upload-label");
              if (labelEl) {
                labelEl.removeAttribute("disabled");
                labelEl.textContent = "Выберите фото";
              }
            });
        }
      });
    }

    
    const removeButton = element.querySelector(".file-upload-remove-button");
    if (removeButton) {
      removeButton.addEventListener("click", () => {
        imageUrl = ""; 
        if (typeof onImageUrlChange === 'function') { 
          onImageUrlChange(imageUrl); 
        }
        render(); 
      });
    }
  };

  
  render();
}

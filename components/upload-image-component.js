
import { uploadImage } from "../api.js";


export function renderUploadImageComponent({ element, onImageUrlChange }) {
 
  if (!element) {
    console.error("UploadImageComponent: Не передан DOM-элемент для рендеринга.");
    return;
  }

  let imageUrl = "";

  const render = () => {
    const html = `
      <div class="upload-image">
        ${imageUrl
        ? `
          <div class="file-upload-image-container">
            <img class="file-upload-image" src="${imageUrl}" alt="Загруженное изображение">
            <button class="file-upload-remove-button button">Заменить фото</button>
          </div>
          `
        : `
          <label class="file-upload-label secondary-button">
            <input type="file" class="file-upload-input" accept="image/*" style="display:none">
            Выберите фото
          </label>
          `}
      </div>
    `;

    element.innerHTML = html;

    const fileInput = element.querySelector(".file-upload-input");
    if (fileInput) {
    
      fileInput.addEventListener("change", async (event) => {
        
        const files = event.target.files;
        if (files && files.length > 0) {
          const file = files[0];
          const label = element.querySelector(".file-upload-label");
          if (label) {
            label.setAttribute("disabled", "true");
            label.textContent = "Загрузка...";
          }

          try {
            console.log("UploadComponent: Начинаем загрузку файла:", file.name);
            const uploadResult = await uploadImage({ file });
            console.log("UploadComponent: Ответ от uploadImage:", uploadResult);

            
            if (uploadResult && typeof uploadResult === 'object' && uploadResult.fileUrl) {
              imageUrl = uploadResult.fileUrl; 
            } else {
              
              imageUrl = uploadResult?.imageUrl || uploadResult?.url || "";
          
              if (!imageUrl) {
                 console.warn("UploadComponent: URL изображения не найден в ответе API.", uploadResult);
                 throw new Error("URL изображения отсутствует в ответе сервера.");
              }
            }
            console.log("UploadComponent: Извлеченный imageUrl:", imageUrl);

          
            if (typeof onImageUrlChange === 'function') {
              onImageUrlChange(imageUrl);
            } else {
              console.warn("UploadComponent: onImageUrlChange не является функцией.");
            }

            render();
          } catch (error) {
            console.error("UploadComponent: Ошибка загрузки:", error);

           
            if (typeof onImageUrlChange === 'function') {
              onImageUrlChange(""); 
            }

            const label = element.querySelector(".file-upload-label");
            if (label) {
              label.removeAttribute("disabled");
              label.textContent = "Ошибка загрузки";

             
              setTimeout(() => {
               
                const currentLabel = element.querySelector(".file-upload-label");
                if (currentLabel) {
                  currentLabel.textContent = "Выберите фото";
                }
              }, 2000);
            }
          }
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

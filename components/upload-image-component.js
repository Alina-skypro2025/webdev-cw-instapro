import { uploadImage } from "../api.js";

export function renderUploadImageComponent({ element, onImageUrlChange }) {
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

    // Обработчик выбора файла
    const fileInput = element.querySelector(".file-upload-input");
    if (fileInput) {
      fileInput.addEventListener("change", async (event) => {
        const file = event.target.files[0];
        if (file) {
          const label = element.querySelector(".file-upload-label");
          if (label) {
            label.setAttribute("disabled", "true");
            label.textContent = "Загрузка...";
          }

          try {
            const uploadResult = await uploadImage({ file });
            
            // Проверяем разные возможные поля с URL в ответе
            imageUrl = uploadResult.fileUrl || uploadResult.imageUrl || uploadResult.url || "";
            
            if (imageUrl && typeof onImageUrlChange === 'function') {
              onImageUrlChange(imageUrl);
            }
            
            render();
          } catch (error) {
            console.error("Ошибка загрузки:", error);
            
            if (typeof onImageUrlChange === 'function') {
              onImageUrlChange("");
            }
            
            const label = element.querySelector(".file-upload-label");
            if (label) {
              label.removeAttribute("disabled");
              label.textContent = "Ошибка загрузки";
              
              // Возвращаем исходный текст через 2 секунды
              setTimeout(() => {
                if (element.querySelector(".file-upload-label")) {
                  element.querySelector(".file-upload-label").textContent = "Выберите фото";
                }
              }, 2000);
            }
          }
        }
      });
    }

    // Обработчик удаления/замены изображения
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

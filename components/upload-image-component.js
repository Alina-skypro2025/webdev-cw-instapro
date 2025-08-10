
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
            console.log("UploadComponent: Начинаем загрузку файла:", file.name);
            const uploadResult = await uploadImage({ file });
            console.log("UploadComponent: Ответ от uploadImage:", uploadResult);

            // Проверяем разные возможные поля с URL в ответе
            imageUrl = uploadResult.fileUrl || uploadResult.imageUrl || uploadResult.url || "";
            console.log("UploadComponent: Извлеченный imageUrl:", imageUrl);

            if (imageUrl && typeof onImageUrlChange === 'function') {
              onImageUrlChange(imageUrl);
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
                if (element.querySelector(".file-upload-label")) {
                  element.querySelector(".file-upload-label").textContent = "Выберите фото";
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

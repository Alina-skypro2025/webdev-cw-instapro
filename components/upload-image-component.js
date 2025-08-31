// components/upload-image-component.js
import { uploadImage } from "../api.js";

/**
 * Рендерит компонент загрузки изображения.
 * @param {Object} params - Параметры компонента.
 * @param {HTMLElement} params.element - DOM-элемент, в который будет отрендерен компонент.
 * @param {Function} params.onImageUrlChange - Callback, вызываемый при изменении URL изображения.
 *   Принимает новый URL изображения в качестве аргумента.
 */
export function renderUploadImageComponent({ element, onImageUrlChange }) {
  // Проверяем, что переданный элемент существует
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
      // Исправлено: Используем 'change' событие (как в исходном коде), но добавляем проверку files[0]
      fileInput.addEventListener("change", async (event) => {
        // Исправлено: Получаем файл из event.target.files
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

            // Исправлено: Уточнена логика извлечения URL.
            // Согласно API документации, сервер возвращает объект с полем 'fileUrl'.
            // Также добавлена проверка, что uploadResult - объект.
            if (uploadResult && typeof uploadResult === 'object' && uploadResult.fileUrl) {
              imageUrl = uploadResult.fileUrl; // Используем конкретное поле, как в API документации
            } else {
              // Если fileUrl нет, попробуем другие возможные поля (на случай изменений API)
              imageUrl = uploadResult?.imageUrl || uploadResult?.url || "";
              // Если URL всё ещё пустой, это может быть признаком ошибки, даже если промис зарезолвился
              if (!imageUrl) {
                 console.warn("UploadComponent: URL изображения не найден в ответе API.", uploadResult);
                 throw new Error("URL изображения отсутствует в ответе сервера.");
              }
            }
            console.log("UploadComponent: Извлеченный imageUrl:", imageUrl);

            // Исправлено: Проверка типа onImageUrlChange перед вызовом
            if (typeof onImageUrlChange === 'function') {
              onImageUrlChange(imageUrl);
            } else {
              console.warn("UploadComponent: onImageUrlChange не является функцией.");
            }

            render();
          } catch (error) {
            console.error("UploadComponent: Ошибка загрузки:", error);

            // Исправлено: Проверка типа onImageUrlChange перед вызовом
            if (typeof onImageUrlChange === 'function') {
              onImageUrlChange(""); // Передаем пустую строку при ошибке
            }

            const label = element.querySelector(".file-upload-label");
            if (label) {
              label.removeAttribute("disabled");
              label.textContent = "Ошибка загрузки";

              // Возвращаем исходный текст через 2 секунды
              setTimeout(() => {
                // Исправлено: Повторная проверка существования элемента перед изменением текста
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
        // Исправлено: Проверка типа onImageUrlChange перед вызовом
        if (typeof onImageUrlChange === 'function') {
          onImageUrlChange(imageUrl);
        }
        render();
      });
    }
  };

  render();
}

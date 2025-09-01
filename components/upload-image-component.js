// components/upload-image-component.js
import { uploadImage } from "../api.js";

/**
 * Рендерит компонент загрузки изображения.
 * @param {Object} params - Параметры компонента.
 * @param {HTMLElement} params.element - DOM-элемент, в который будет отрендерен компонент.
 * @param {Function} params.onImageUrl - Callback, вызываемый при изменении URL изображения.
 *   Принимает новый URL изображения в качестве аргумента.
 */
export function renderUploadImageComponent({ element, onImageUrl }) {
  // Проверяем, что переданный элемент существует
  if (!element) {
    console.error("UploadImageComponent: Не передан DOM-элемент для рендеринга.");
    return;
  }

  // Переменная для хранения URL загруженного изображения
  let imageUrl = "";

  // Функция для рендеринга компонента
  const render = () => {
    // HTML разметка компонента в зависимости от того, загружено ли изображение
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

    // Вставляем HTML в переданный элемент
    element.innerHTML = html;

    // Получаем input для выбора файла
    const fileInput = element.querySelector(".file-upload-input");
    if (fileInput) {
      // Добавляем обработчик события change для input
      // Используем 'input' или 'change', оба работают, 'change' стандартнее для файлов
      fileInput.addEventListener("change", async (event) => {
        // Получаем выбранный файл
        const files = event.target.files;
        if (files && files.length > 0) {
          const file = files[0];
          // Получаем label для отображения состояния загрузки
          const label = element.querySelector(".file-upload-label");
          if (label) {
            // Блокируем label и меняем текст на "Загрузка..."
            label.setAttribute("disabled", "true");
            label.textContent = "Загрузка...";
          }

          try {
            console.log("UploadComponent: Начинаем загрузку файла:", file.name);
            // Вызываем API для загрузки изображения
            const uploadResult = await uploadImage({ file });
            console.log("UploadComponent: Ответ от uploadImage:", uploadResult);

            // Извлекаем URL изображения из ответа API
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

            // Проверяем тип onImageUrl перед вызовом
            if (typeof onImageUrl === 'function') {
              // Вызываем callback с новым URL
              onImageUrl(imageUrl);
            } else {
              console.warn("UploadComponent: onImageUrl не является функцией.");
            }

            // Перерендериваем компонент для отображения загруженного изображения
            render();
          } catch (error) {
            console.error("UploadComponent: Ошибка загрузки:", error);

            // Вызываем callback с пустой строкой в случае ошибки
            if (typeof onImageUrl === 'function') {
              onImageUrl(""); // Передаем пустую строку при ошибке
            }

            // Получаем label для отображения ошибки
            const label = element.querySelector(".file-upload-label");
            if (label) {
              // Разблокируем label
              label.removeAttribute("disabled");
              // Отображаем сообщение об ошибке
              label.textContent = "Ошибка загрузки";

              // Возвращаем исходный текст через 2 секунды
              setTimeout(() => {
                // Повторно ищем label, так как DOM мог измениться
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

    // Получаем кнопку для удаления/замены изображения
    const removeButton = element.querySelector(".file-upload-remove-button");
    if (removeButton) {
      // Добавляем обработчик события click для кнопки
      removeButton.addEventListener("click", () => {
        // Очищаем URL изображения
        imageUrl = "";
        // Вызываем callback с пустой строкой
        if (typeof onImageUrl === 'function') {
          onImageUrl(imageUrl);
        }
        // Перерендериваем компонент для отображения кнопки выбора фото
        render();
      });
    }
  };

  // Выполняем первый рендер компонента
  render();
}

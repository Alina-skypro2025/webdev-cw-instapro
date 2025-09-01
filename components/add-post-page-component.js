// components/add-post-page-component.js
import { renderUploadImageComponent } from "./upload-image-component.js";
// Импортируем getToken для дополнительной проверки (не обязательно, так как проверка есть в index.js)
// import { getToken } from "../index.js"; // Можно убрать, если не используется напрямую здесь

/**
 * Рендер компонента страницы добавления поста.
 * @param {Object} params - Параметры компонента.
 * @param {HTMLElement} params.appEl - Корневой элемент приложения.
 * @param {Function} params.onAddPostClick - Callback для обработки клика по кнопке "Добавить".
 */
export function renderAddPostPageComponent({ appEl, onAddPostClick }) {
  // Переменная для хранения URL загруженного изображения
  let currentImageUrl = "";

  // HTML разметка компонента
  const appHtml = `
    <div class="page-container">
      <div class="header-container"></div>
      <div class="form">
        <h3 class="form-title">Добавить пост</h3>
        <div class="form-inputs">
          <div class="upload-image-container">
            <div id="upload-image-container"></div>
          </div>
          <label>
            Описание поста
            <textarea class="form-textarea" id="post-description" placeholder="Подпись к фото..."></textarea>
          </label>
          <!-- Элемент ошибки изначально скрыт -->
          <div class="form-error" id="form-error" style="display: none;"></div>
        </div>
        <div class="form-footer">
          <button class="button" id="add-button">Добавить</button>
        </div>
      </div>
    </div>
  `;

  // Вставляем HTML в корневой элемент
  appEl.innerHTML = appHtml;

  // Получаем элементы DOM
  const uploadContainerElement = document.getElementById("upload-image-container");
  const addButton = document.getElementById("add-button");
  const descriptionElement = document.getElementById("post-description");
  const errorElement = document.getElementById("form-error");

  // Проверяем существование всех необходимых элементов
  if (!uploadContainerElement || !addButton || !descriptionElement || !errorElement) {
    console.error("AddPostComponent: Один или несколько необходимых элементов форм не найдены.");
    // Можно отобразить общую ошибку, если критично
    // if (errorElement) {
    //   errorElement.style.display = 'block';
    //   errorElement.textContent = "Ошибка инициализации формы.";
    // }
    return;
  }

  // --- Логика отображения/скрытия ошибки ---
  /**
   * Показать сообщение об ошибке.
   * @param {string} message - Текст сообщения об ошибке.
   */
  const showError = (message) => {
    errorElement.textContent = message;
    errorElement.style.display = 'block'; // Делаем элемент видимым
  };

  /**
   * Скрыть сообщение об ошибке.
   */
  const hideError = () => {
    errorElement.textContent = "";
    errorElement.style.display = 'none'; // Скрываем элемент
  };

  // --- Рендер компонента загрузки изображения ---
  renderUploadImageComponent({
    element: uploadContainerElement,
    // Callback, который вызывается при изменении URL изображения
    onImageUrl: (imageUrl) => {
      console.log("AddPostComponent: URL изображения обновлен:", imageUrl);
      // Обновляем переменную с URL изображения
      currentImageUrl = imageUrl;

      // Если изображение загружено и ранее была ошибка "Загрузите изображение", скрываем её
      // Также скрываем ошибку при любой успешной загрузке, если форма была отправлена с этой ошибкой
      if (currentImageUrl && errorElement.textContent === "Загрузите изображение") {
         hideError();
      }
    },
  });

  // --- Обработчики событий для полей ввода ---
  // Добавляем обработчик события input для textarea описания
  descriptionElement.addEventListener("input", () => {
    // Если пользователь начал вводить текст и ранее была ошибка "Введите описание поста", скрываем её
    if (descriptionElement.value.trim() !== "" && errorElement.textContent === "Введите описание поста") {
      hideError();
    }
  });

  // --- Обработчик события для кнопки "Добавить" ---
  // Добавляем обработчик события click для кнопки "Добавить"
  addButton.addEventListener("click", () => {
    // Получаем описание и убираем лишние пробелы
    const description = descriptionElement.value.trim();

    // --- Проверка валидности формы ---
    // Сначала скрываем любую предыдущую ошибку
    hideError();

    // Проверяем обязательные поля
    if (!description) {
      showError("Введите описание поста");
      // Фокус на поле описания для удобства
      descriptionElement.focus();
      return;
    }

    if (!currentImageUrl) {
      showError("Загрузите изображение");
      // Фокус на область загрузки изображения (или кнопку) может быть сложнее, пропустим
      return;
    }

    // --- Вызов обработчика из index.js ---
    // Если все проверки пройдены, вызываем переданную функцию обработки клика
    // Проверка токена и других действий происходит в index.js
    onAddPostClick({
      description,
      imageUrl: currentImageUrl,
    });
  });
}

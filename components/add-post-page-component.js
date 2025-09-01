// add-post-page-component.js
import { renderUploadImageComponent } from "./upload-image-component.js";
import { getToken } from "../index.js";

export function renderAddPostPageComponent({ appEl, onAddPostClick }) {
  let currentImageUrl = "";

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
            <textarea class="form-textarea" id="post-description"></textarea>
          </label>
          <div class="form-error" id="form-error"></div> <!-- Изначально пустой -->
        </div>
        <div class="form-footer">
          <button class="button" id="add-button">Добавить</button>
        </div>
      </div>
    </div>
  `;

  appEl.innerHTML = appHtml;

  const uploadContainerElement = document.getElementById("upload-image-container");
  const addButton = document.getElementById("add-button");
  const descriptionElement = document.getElementById("post-description");
  const errorElement = document.getElementById("form-error");

  // Проверка существования всех необходимых элементов
  if (!uploadContainerElement || !addButton || !descriptionElement || !errorElement) {
    console.error("AddPostComponent: Один или несколько необходимых элементов форм не найдены.");
    // Можно отобразить общую ошибку в errorElement, если он существует
    if (errorElement) {
      errorElement.textContent = "Ошибка инициализации формы.";
    }
    return;
  }

  // Рендер компонента загрузки изображения
  renderUploadImageComponent({
    element: uploadContainerElement,
    onImageUrlChange: (imageUrl) => {
      console.log("AddPostComponent: URL изображения обновлен:", imageUrl);
      currentImageUrl = imageUrl;
      // Скрываем ошибку при успешной загрузке изображения
      if (errorElement.textContent === "Загрузите изображение") {
         errorElement.textContent = "";
      }
    },
  });

  // Обработчик ввода в поле описания
  descriptionElement.addEventListener("input", () => {
    // Скрываем ошибку при вводе текста, если она была о необходимости ввода описания
    if (errorElement.textContent === "Введите описание поста" && descriptionElement.value.trim() !== "") {
      errorElement.textContent = "";
    }
  });

  // Обработчик клика по кнопке "Добавить"
  addButton.addEventListener("click", () => {
    const description = descriptionElement.value.trim();

    // Очищаем предыдущие ошибки перед проверкой
    errorElement.textContent = "";

    // Проверяем обязательные поля
    if (!description) {
      errorElement.textContent = "Введите описание поста";
      return;
    }

    if (!currentImageUrl) {
      errorElement.textContent = "Загрузите изображение";
      return;
    }

    // Проверка токена авторизации
    const token = getToken();
    if (!token) {
      errorElement.textContent = "Ошибка авторизации. Пожалуйста, войдите снова.";
      console.warn("AddPostComponent: Попытка добавить пост без токена.");
      return;
    }

    console.log("AddPostComponent: Вызов onAddPostClick с данными:", { description, imageUrl: currentImageUrl });

    // Вызываем переданную функцию обработки клика
    onAddPostClick({
      description,
      imageUrl: currentImageUrl,
    });
  });
}

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
          <div class="form-error" id="form-error"></div>
        </div>
        <div class="form-footer">
          <button class="button" id="add-button">Добавить</button>
        </div>
      </div>
    </div>
  `;

  appEl.innerHTML = appHtml;

  // Исправлено: Получаем элемент контейнера и передаем его в renderUploadImageComponent
  const uploadContainerElement = document.getElementById("upload-image-container");
  if (uploadContainerElement) {
    renderUploadImageComponent({
      element: uploadContainerElement, // Передаем сам элемент
      onImageUrlChange: (imageUrl) => {
        console.log("AddPostComponent: URL изображения обновлен:", imageUrl);
        currentImageUrl = imageUrl;
        // Обновляем состояние формы при изменении изображения
        updateFormValidity();
      },
    });
  } else {
    console.error("AddPostComponent: Элемент 'upload-image-container' не найден в DOM.");
  }

  const addButton = document.getElementById("add-button");
  const descriptionElement = document.getElementById("post-description");
  const errorElement = document.getElementById("form-error");

  // Исправлено: Добавлена проверка существования элементов перед добавлением обработчиков
  if (addButton && descriptionElement && errorElement) {
    // Обновляем состояние формы при изменении описания
    descriptionElement.addEventListener("input", () => {
      updateFormValidity();
    });

    addButton.addEventListener("click", () => {
      // Проверяем обязательные поля
      if (!descriptionElement.value.trim()) {
        errorElement.textContent = "Введите описание поста";
        return;
      }

      if (!currentImageUrl) {
        errorElement.textContent = "Загрузите изображение";
        return;
      }

      // Получаем токен (проверка наличия токена уже должна быть в index.js в onAddPostClick)
      // Но всё равно делаем проверку для дополнительной безопасности на этом уровне
      const token = getToken();
      if (!token) {
        errorElement.textContent = "Ошибка авторизации. Пожалуйста, войдите снова.";
        console.warn("AddPostComponent: Попытка добавить пост без токена.");
        // Здесь можно добавить перенаправление на страницу авторизации, если необходимо
        // Например: import { goToPage, AUTH_PAGE } from "../routes.js"; goToPage(AUTH_PAGE);
        return;
      }

      console.log("AddPostComponent: Вызов onAddPostClick с данными:", { description: descriptionElement.value.trim(), imageUrl: currentImageUrl });

      // Вызываем переданную функцию обработки клика
      onAddPostClick({
        description: descriptionElement.value.trim(),
        imageUrl: currentImageUrl,
      });
    });
  } else {
    console.error("AddPostComponent: Один или несколько необходимых элементов форм не найдены.");
  }

  // Функция для обновления состояния формы
  function updateFormValidity() {
    const description = descriptionElement.value.trim();
    const hasDescription = description.length > 0;
    const hasImageUrl = currentImageUrl !== "";

    // Если все поля заполнены, убираем ошибку
    if (hasDescription && hasImageUrl) {
      errorElement.textContent = "";
    }
  }
}

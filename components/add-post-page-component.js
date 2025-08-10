
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

  
  const uploadContainerElement = document.getElementById("upload-image-container");
  if (uploadContainerElement) {
    renderUploadImageComponent({
      element: uploadContainerElement, 
      onImageUrlChange: (imageUrl) => {
        console.log("AddPostComponent: URL изображения обновлен:", imageUrl);
        currentImageUrl = imageUrl;
      },
    });
  } else {
    console.error("AddPostComponent: Элемент 'upload-image-container' не найден в DOM.");
  }

  const addButton = document.getElementById("add-button");
  const descriptionElement = document.getElementById("post-description");
  const errorElement = document.getElementById("form-error");

 
  if (addButton && descriptionElement && errorElement) {
    addButton.addEventListener("click", () => {
      const description = descriptionElement.value;

     
      errorElement.textContent = "";

      
      if (!description.trim()) {
        errorElement.textContent = "Введите описание поста";
        return;
      }

      if (!currentImageUrl) {
        errorElement.textContent = "Загрузите изображение";
        return;
      }

   
      const token = getToken();
      if (!token) {
        errorElement.textContent = "Ошибка авторизации. Пожалуйста, войдите снова.";
        console.warn("AddPostComponent: Попытка добавить пост без токена.");
      
        return;
      }

      console.log("AddPostComponent: Вызов onAddPostClick с данными:", { description, imageUrl: currentImageUrl });


      onAddPostClick({
        description: description.trim(),
        imageUrl: currentImageUrl,
      });
    });
  } else {
    console.error("AddPostComponent: Один или несколько необходимых элементов форм не найдены.");
  }
}

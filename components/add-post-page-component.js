import { renderUploadImageComponent } from "./upload-image-component.js";

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

  renderUploadImageComponent({
    element: document.getElementById("upload-image-container"),
    onImageUrlChange: (imageUrl) => {
      currentImageUrl = imageUrl;
    },
  });

  const addButton = document.getElementById("add-button");
  const descriptionElement = document.getElementById("post-description");
  const errorElement = document.getElementById("form-error");

  if (addButton && descriptionElement && errorElement) {
    addButton.addEventListener("click", () => {
      const description = descriptionElement.value.trim();

     
      errorElement.textContent = "";

      
      if (!description) {
        errorElement.textContent = "Введите описание поста";
        return;
      }

      if (!currentImageUrl) {
        errorElement.textContent = "Загрузите изображение";
        return;
      }

      onAddPostClick({
        description,
        imageUrl: currentImageUrl,
      });
    });
  }
}

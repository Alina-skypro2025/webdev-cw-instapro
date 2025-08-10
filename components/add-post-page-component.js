import { addPost } from "../api.js"; 
import { renderUploadImageComponent } from "./upload-image-component.js";

export function renderAddPostPageComponent({ appEl, onPostAdded }) {
  let currentImageUrl = "";

  appEl.innerHTML = `
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
            <textarea class="form-textarea" id="post-description" rows="4" placeholder="Подпись к фото..."></textarea>
          </label>
          <div class="form-actions">
            <button class="button" id="add-button">Опубликовать</button>
            <button class="button button-secondary" id="cancel-button">Отмена</button>
          </div>
        </div>
      </div>
    </div>
  `;

  renderUploadImageComponent({
    elementId: "upload-image-container",
    onImageUrl: (url) => {
      currentImageUrl = url;
      console.log("Готовим данные:", { description: getDesc(), imageUrl: currentImageUrl });
    },
  });

  const getDesc = () => (document.getElementById("post-description").value || "").trim();

  document.getElementById("add-button").addEventListener("click", async () => {
    try {
      const description = getDesc();

      if (!currentImageUrl) {
        alert("Сначала загрузите изображение.");
        return;
      }
      if (!description) {
        alert("Напишите описание.");
        return;
      }

  
      const token = getToken();
      if (!token) {
        alert("Ошибка авторизации. Пожалуйста, войдите снова.");
        return;
      }

      await addPost({ token, description, imageUrl: currentImageUrl });
      onPostAdded?.();
    } catch (e) {
      console.error(e);
      alert(e.message || "Ошибка при добавлении поста");
    }
  });

  document.getElementById("cancel-button").addEventListener("click", () => {
    history.back();
  });
}

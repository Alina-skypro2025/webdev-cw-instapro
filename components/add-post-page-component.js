import { uploadImage } from "../api.js";
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
            <div id="upload-image-conrainer"></div>
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
    element: document.getElementById("upload-image-conrainer"),
    onImageUrlChange: (imageUrl) => {
      console.log("URL изображения обновлен:", imageUrl);
      currentImageUrl = imageUrl; 
    },
  });

  
  document.getElementById("add-button").addEventListener("click", () => {
    const description = document.getElementById("post-description").value.trim();
    
    console.log("Попытка добавить пост:", { description, imageUrl: currentImageUrl });
    
    if (!description) {
      document.getElementById("form-error").textContent = "Введите описание поста";
      return;
    }
    
    if (!currentImageUrl) {
      document.getElementById("form-error").textContent = "Загрузите изображение";
      return;
    }
    
    onAddPostClick({
      description,
      imageUrl: currentImageUrl,
    });
  });
}

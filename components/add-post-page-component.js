import { uploadImage } from "../api.js";
import { renderUploadImageComponent } from "./upload-image-component.js";
import { renderHeaderComponent } from "./header-component.js";

export function renderAddPostPageComponent({ appEl, onAddPostClick }) {
  let imageUrl = "";

  const render = () => {
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

    
    renderHeaderComponent({
      element: document.querySelector(".header-container"),
    });

  
    renderUploadImageComponent({
      element: document.getElementById("upload-image-conrainer"),
      onImageUpload: (imageFile) => {
        document.getElementById("add-button").setAttribute("disabled", true);
        
        uploadImage({ file: imageFile })
          .then(({ imageUrl: uploadedImageUrl }) => {
            imageUrl = uploadedImageUrl;
            document.getElementById("add-button").removeAttribute("disabled");
          })
          .catch((error) => {
            console.error("Ошибка загрузки изображения:", error);
            document.getElementById("form-error").textContent = "Ошибка загрузки изображения";
            document.getElementById("add-button").removeAttribute("disabled");
          });
      },
    });

 
    document.getElementById("add-button").addEventListener("click", () => {
      const description = document.getElementById("post-description").value;
      
     
      if (!description.trim()) {
        document.getElementById("form-error").textContent = "Введите описание поста";
        return;
      }
      
      if (!imageUrl) {
        document.getElementById("form-error").textContent = "Загрузите изображение";
        return;
      }
      
   
      onAddPostClick({
        description: description.trim(),
        imageUrl,
      });
    });
  };

  render();
}

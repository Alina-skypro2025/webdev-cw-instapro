import { renderHeaderComponent } from "./header-component.js";


export function renderLoadingPageComponent({ appEl, user, goToPage }) {
 
  const appHtml = `
              <div class="page-container">
                <div class="header-container"></div>
                <div class="loading-page">
                  <div class="loading-spinner">
                    <div class="spinner"></div>
                    <p>Загружаем данные...</p>
                  </div>
                </div>
              </div>`;

 
  appEl.innerHTML = appHtml;


  renderHeaderComponent({
    user,
    element: document.querySelector(".header-container"),
    goToPage,
  });
}

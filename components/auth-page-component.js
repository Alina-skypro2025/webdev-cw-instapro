// components/auth-page-component.js
import { loginUser, registerUser } from "../api.js";
import { renderHeaderComponent } from "./header-component.js";
import { renderUploadImageComponent } from "./upload-image-component.js";

/**
 * Компонент страницы авторизации/регистрации.
 * @param {Object} params - Параметры компонента.
 * @param {HTMLElement} params.appEl - Корневой элемент приложения.
 * @param {Function} params.setUser - Функция для установки данных пользователя после успешного входа/регистрации.
 * @param {Object|null} params.user - Текущий пользователь (не используется напрямую здесь, но передается в header).
 * @param {Function} params.goToPage - Функция для навигации между страницами.
 */
export function renderAuthPageComponent({ appEl, setUser, user, goToPage }) {
  /**
   * Флаг, указывающий текущий режим формы.
   * Если `true`, форма находится в режиме входа. Если `false`, в режиме регистрации.
   * @type {boolean}
   */
  let isLoginMode = true;

  /**
   * URL изображения, загруженного пользователем при регистрации.
   * Используется только в режиме регистрации.
   * @type {string}
   */
  let imageUrl = "";

  /**
   * Рендерит форму авторизации или регистрации.
   * В зависимости от значения `isLoginMode` отображает соответствующий интерфейс.
   */
  const renderForm = () => {
    const appHtml = `
      <div class="page-container">
          <div class="header-container"></div>
          <div class="form">
              <h3 class="form-title">
                ${
                  isLoginMode
                    ? "Вход в&nbsp;Instapro"
                    : "Регистрация в&nbsp;Instapro"
                }
              </h3>
              <div class="form-inputs">
                  ${
                    !isLoginMode
                      ? `
                      <div class="upload-image-container">
                        <div id="upload-image-conrainer"></div> <!-- Исправлен ID -->
                      </div>
                      <input type="text" id="name-input" class="input" placeholder="Имя" />
                      `
                      : ""
                  }
                  <input type="text" id="login-input" class="input" placeholder="Логин" />
                  <input type="password" id="password-input" class="input" placeholder="Пароль" />
                  <div class="form-error" id="form-error" style="display: none;"></div> <!-- Изначально скрыт -->
                  <button class="button" id="login-button">${
                    isLoginMode ? "Войти" : "Зарегистрироваться"
                  }</button>
              </div>
              <div class="form-footer">
                <p class="form-footer-title">
                  ${isLoginMode ? "Нет аккаунта?" : "Уже есть аккаунт?"}
                  <button class="link-button" id="toggle-button">
                    ${isLoginMode ? "Зарегистрироваться." : "Войти."}
                  </button>
                </p>
              </div>
          </div>
      </div>    
    `;

    appEl.innerHTML = appHtml;

    /**
     * Показать сообщение об ошибке.
     * @param {string} message - Текст сообщения об ошибке.
     */
    const showError = (message) => {
      const errorElement = appEl.querySelector(".form-error");
      if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
      }
    };

    /**
     * Скрыть сообщение об ошибке.
     */
    const hideError = () => {
      const errorElement = appEl.querySelector(".form-error");
      if (errorElement) {
        errorElement.textContent = "";
        errorElement.style.display = 'none';
      }
    };

    // Рендерим заголовок страницы
    renderHeaderComponent({
      element: document.querySelector(".header-container"),
      user, // Передаем текущего пользователя (может быть null)
      goToPage, // Передаем функцию навигации
    });

    // Если режим регистрации, рендерим компонент загрузки изображения
    const uploadImageContainer = appEl.querySelector(".upload-image-container");
    if (uploadImageContainer && !isLoginMode) {
      // Исправлен ID контейнера (был опечатка: "conrainer" вместо "container")
      const uploadImageInnerContainer = appEl.querySelector("#upload-image-conrainer");
      if (uploadImageInnerContainer) {
        renderUploadImageComponent({
          element: uploadImageInnerContainer,
          onImageUrl: (newImageUrl) => { // Используем правильное имя параметра
            console.log("AuthPage: URL изображения обновлен:", newImageUrl);
            imageUrl = newImageUrl;
            
            // Если изображение загружено и была ошибка "Не выбрана фотография", скрываем её
            const errorElement = appEl.querySelector(".form-error");
            if (imageUrl && errorElement && errorElement.textContent === "Не выбрана фотография") {
               hideError();
            }
          },
        });
      }
    }

    // Обработка клика на кнопку входа/регистрации
    const loginButton = document.getElementById("login-button");
    if (loginButton) {
      loginButton.addEventListener("click", () => {
        hideError(); // Скрываем предыдущие ошибки

        if (isLoginMode) {
          // Обработка входа
          const login = document.getElementById("login-input")?.value?.trim();
          const password = document.getElementById("password-input")?.value?.trim();

          if (!login) {
            showError("Введите логин");
            return;
          }

          if (!password) {
            showError("Введите пароль");
            return;
          }

          loginUser({ login, password })
            .then((userData) => {
              console.log("AuthPage: Успешный вход:", userData);
              setUser(userData.user); // Устанавливаем пользователя из ответа API
            })
            .catch((error) => {
              console.warn("AuthPage: Ошибка входа:", error);
              showError(error.message);
            });
        } else {
          // Обработка регистрации
          const login = document.getElementById("login-input")?.value?.trim();
          const name = document.getElementById("name-input")?.value?.trim();
          const password = document.getElementById("password-input")?.value?.trim();

          if (!name) {
            showError("Введите имя");
            return;
          }

          if (!login) {
            showError("Введите логин");
            return;
          }

          if (!password) {
            showError("Введите пароль");
            return;
          }

          if (!imageUrl) {
            showError("Не выбрана фотография");
            return;
          }

          registerUser({ login, password, name, imageUrl })
            .then((userData) => {
              console.log("AuthPage: Успешная регистрация:", userData);
              setUser(userData.user); // Устанавливаем пользователя из ответа API
            })
            .catch((error) => {
              console.warn("AuthPage: Ошибка регистрации:", error);
              showError(error.message);
            });
        }
      });
    }

    // Обработка переключения режима (вход ↔ регистрация)
    const toggleButton = document.getElementById("toggle-button");
    if (toggleButton) {
      toggleButton.addEventListener("click", () => {
        isLoginMode = !isLoginMode;
        renderForm(); // Перерисовываем форму с новым режимом
      });
    }
    
    // --- Добавляем обработчики для скрытия ошибок при вводе ---
    if (!isLoginMode) {
        // Режим регистрации
        const nameInput = document.getElementById("name-input");
        const loginInputReg = document.getElementById("login-input");
        const passwordInputReg = document.getElementById("password-input");
        
        if (nameInput) {
            nameInput.addEventListener("input", () => {
                const errorElement = appEl.querySelector(".form-error");
                if (errorElement && errorElement.textContent === "Введите имя") {
                    hideError();
                }
            });
        }
        if (loginInputReg) {
            loginInputReg.addEventListener("input", () => {
                const errorElement = appEl.querySelector(".form-error");
                if (errorElement && errorElement.textContent === "Введите логин") {
                    hideError();
                }
            });
        }
        if (passwordInputReg) {
            passwordInputReg.addEventListener("input", () => {
                const errorElement = appEl.querySelector(".form-error");
                if (errorElement && errorElement.textContent === "Введите пароль") {
                    hideError();
                }
            });
        }
        // Обработчик для ошибки "Не выбрана фотография" уже добавлен выше в onImageUrl
    } else {
        // Режим входа
        const loginInputLogin = document.getElementById("login-input");
        const passwordInputLogin = document.getElementById("password-input");
        
        if (loginInputLogin) {
            loginInputLogin.addEventListener("input", () => {
                const errorElement = appEl.querySelector(".form-error");
                if (errorElement && errorElement.textContent === "Введите логин") {
                    hideError();
                }
            });
        }
        if (passwordInputLogin) {
            passwordInputLogin.addEventListener("input", () => {
                const errorElement = appEl.querySelector(".form-error");
                if (errorElement && errorElement.textContent === "Введите пароль") {
                    hideError();
                }
            });
        }
    }
  };

  // Инициализация формы
  renderForm();
}

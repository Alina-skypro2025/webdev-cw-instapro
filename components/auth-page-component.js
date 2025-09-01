// auth-page-component.js
import { renderUploadImageComponent } from "./upload-image-component.js";
import { getToken } from "../index.js";

export function renderAuthPageComponent({ appEl, setUser, user, goToPage }) {
  const appHtml = `
    <div class="page-container">
      <div class="header-container"></div>
      <div class="form">
        <h3 class="form-title">Регистрация в Instapro</h3>
        <div class="form-inputs">
          <div class="upload-image-container">
            <div id="upload-image-container"></div>
          </div>
          <label>
            Логин
            <input type="text" id="login-input" />
          </label>
          <label>
            Имя пользователя
            <input type="text" id="name-input" />
          </label>
          <label>
            Пароль
            <input type="password" id="password-input" />
          </label>
          <div class="form-error" id="form-error"></div>
        </div>
        <div class="form-footer">
          <button class="button" id="register-button">Зарегистрироваться</button>
        </div>
      </div>
    </div>
  `;

  appEl.innerHTML = appHtml;

  // Получаем элементы DOM
  const uploadContainerElement = document.getElementById("upload-image-container");
  const loginInput = document.getElementById("login-input");
  const nameInput = document.getElementById("name-input");
  const passwordInput = document.getElementById("password-input");
  const errorElement = document.getElementById("form-error");
  const registerButton = document.getElementById("register-button");

  // Проверяем существование всех необходимых элементов
  if (!uploadContainerElement || !loginInput || !nameInput || !passwordInput || !errorElement || !registerButton) {
    console.error("AuthPageComponent: Один или несколько необходимых элементов формы не найдены.");
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
      console.log("AuthPageComponent: URL изображения обновлен:", imageUrl);
      // Если изображение загружено, скрываем ошибку "Не выбрана фотография"
      if (imageUrl && errorElement.textContent === "Не выбрана фотография") {
         hideError();
      }
    },
  });

  // --- Обработчики событий для полей ввода ---
  // Добавляем обработчик события input для поля логина
  loginInput.addEventListener("input", () => {
    // Если пользователь начал вводить логин и ранее была ошибка "Неверный логин", скрываем её
    if (loginInput.value.trim() !== "" && errorElement.textContent === "Неверный логин") {
      hideError();
    }
  });

  // Добавляем обработчик события input для поля имени
  nameInput.addEventListener("input", () => {
    // Если пользователь начал вводить имя и ранее была ошибка "Неверное имя", скрываем её
    if (nameInput.value.trim() !== "" && errorElement.textContent === "Неверное имя") {
      hideError();
    }
  });

  // Добавляем обработчик события input для поля пароля
  passwordInput.addEventListener("input", () => {
    // Если пользователь начал вводить пароль и ранее была ошибка "Неверный пароль", скрываем её
    if (passwordInput.value.trim() !== "" && errorElement.textContent === "Неверный пароль") {
      hideError();
    }
  });

  // --- Обработчик события для кнопки "Зарегистрироваться" ---
  // Добавляем обработчик события click для кнопки "Зарегистрироваться"
  registerButton.addEventListener("click", () => {
    // Получаем значения полей и убираем лишние пробелы
    const login = loginInput.value.trim();
    const name = nameInput.value.trim();
    const password = passwordInput.value.trim();

    // Сначала скрываем любую предыдущую ошибку
    hideError();

    // Проверяем обязательные поля
    if (!login) {
      showError("Введите логин");
      loginInput.focus();
      return;
    }

    if (!name) {
      showError("Введите имя пользователя");
      nameInput.focus();
      return;
    }

    if (!password) {
      showError("Введите пароль");
      passwordInput.focus();
      return;
    }

    // Проверка токена авторизации (необходима для регистрации)
    const token = getToken();
    if (!token) {
      showError("Ошибка авторизации. Пожалуйста, войдите снова.");
      console.warn("AuthPageComponent: Попытка регистрации без токена.");
      return;
    }

    // Вызываем API для регистрации пользователя
    registerUser({ login, password, name })
      .then((result) => {
        console.log("AuthPageComponent: Пользователь успешно зарегистрирован:", result);
        // Устанавливаем нового пользователя
        setUser(result.user);
        // Перенаправляем на главную страницу
        goToPage(POSTS_PAGE);
      })
      .catch((error) => {
        console.error("AuthPageComponent: Ошибка при регистрации:", error);
        // Показываем сообщение пользователю
        showError(error.message);
      });
  });
}

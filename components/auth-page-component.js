// auth-page-component.js
import { renderHeaderComponent } from "./header-component.js";
import { getToken } from "../index.js";
import { loginUser } from "../api.js";

export function renderAuthPageComponent({ appEl, setUser }) {
  const appHtml = `
    <div class="page-container">
      <div class="header-container"></div>
      <div class="form">
        <h3 class="form-title">Вход в Instapro</h3>
        <div class="form-inputs">
          <label>
            Логин
            <input type="text" id="login-input" />
          </label>
          <label>
            Пароль
            <input type="password" id="password-input" />
          </label>
          <div class="form-error" id="form-error"></div>
        </div>
        <div class="form-footer">
          <button class="button" id="login-button">Войти</button>
        </div>
      </div>
    </div>
  `;

  appEl.innerHTML = appHtml;

  renderHeaderComponent({
    element: document.querySelector(".header-container"),
    onLogout: () => {
      console.log("AuthPageComponent: Пользователь вышел.");
      setUser(null);
    },
  });

  const loginButton = document.getElementById("login-button");
  const loginInput = document.getElementById("login-input");
  const passwordInput = document.getElementById("password-input");
  const errorElement = document.getElementById("form-error");

  if (loginButton && loginInput && passwordInput && errorElement) {
    loginButton.addEventListener("click", () => {
      const login = loginInput.value;
      const password = passwordInput.value;

      errorElement.textContent = ""; // Очищаем ошибку перед отправкой запроса

      if (!login.trim()) {
        errorElement.textContent = "Введите логин";
        return;
      }

      if (!password.trim()) {
        errorElement.textContent = "Введите пароль";
        return;
      }

      loginUser({ login, password })
        .then((userData) => {
          console.log("AuthPageComponent: Получены данные пользователя:", userData);
          setUser(userData.user);
          alert("Успешная авторизация!");
        })
        .catch((error) => {
          console.error("AuthPageComponent: Ошибка при авторизации:", error);
          errorElement.textContent = error.message; // Отображаем ошибку только после получения ответа от сервера
        });
    });
  } else {
    console.error("AuthPageComponent: Один или несколько необходимых элементов формы не найдены.");
  }
}

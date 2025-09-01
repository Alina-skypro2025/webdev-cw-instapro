// api.js
// Базовый URL API из документации
const personalKey = "prod";
const baseHost = "https://wedev-api.sky.pro";
// Адрес для работы с постами
const postsHost = `${baseHost}/api/v1/${personalKey}/instapro`;

/**
 * Получить список всех постов.
 * @param {Object} params
 * @param {string} [params.token] - Токен авторизации (для получения состояния isLiked).
 * @returns {Promise<Array>} - Массив постов.
 */
export function getPosts({ token }) {
  // Заголовки запроса. Для GET не нужно указывать Content-Type.
  const headers = {};

  // Если токен предоставлен, добавляем его в заголовки
  if (token) {
    headers.Authorization = token;
  }

  return fetch(postsHost, {
    method: "GET",
    headers,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      // API возвращает объект { posts: [...] }
      return data.posts;
    });
}

/**
 * Получить посты конкретного пользователя.
 * @param {Object} params
 * @param {string} [params.token] - Токен авторизации (для получения состояния isLiked).
 * @param {string} params.userId - ID пользователя.
 * @returns {Promise<Array>} - Массив постов пользователя.
 */
export function getUserPosts({ token, userId }) {
  // Заголовки запроса. Для GET не нужно указывать Content-Type.
  const headers = {};

  // Если токен предоставлен, добавляем его в заголовки
  if (token) {
    headers.Authorization = token;
  }

  // Формируем URL для получения постов конкретного пользователя
  const url = `${postsHost}/user-posts/${userId}`;

  return fetch(url, {
    method: "GET",
    headers,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      // API возвращает объект { posts: [...] }
      return data.posts;
    });
}

/**
 * Регистрация нового пользователя.
 * @param {Object} params
 * @param {string} params.login
 * @param {string} params.password
 * @param {string} params.name
 * @param {string} params.imageUrl
 * @returns {Promise<Object>} - Данные нового пользователя.
 */
export function registerUser({ login, password, name, imageUrl }) {
  // Для POST с JSON-телом заголовок Content-Type НУЖЕН
  return fetch(baseHost + "/api/user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      login,
      password,
      name,
      imageUrl,
    }),
  }).then((response) => {
    if (response.status === 400) {
      // Обрабатываем ошибку 400 (например, пользователь уже существует)
      // Получаем сообщение об ошибке от сервера
      return response.json().then((errorData) => {
        // Используем сообщение от сервера, если оно есть, иначе дефолтное
        throw new Error(errorData?.error || "Такой пользователь уже существует");
      });
    }
    if (!response.ok) {
      // Обрабатываем другие HTTP ошибки
      throw new Error("Ошибка при регистрации");
    }
    // Если всё ОК, возвращаем данные пользователя
    return response.json();
  });
}

/**
 * Авторизация пользователя.
 * @param {Object} params
 * @param {string} params.login
 * @param {string} params.password
 * @returns {Promise<Object>} - Данные авторизованного пользователя.
 */
export function loginUser({ login, password }) {
  // Для POST с JSON-телом заголовок Content-Type НУЖЕН
  return fetch(baseHost + "/api/user/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      login,
      password,
    }),
  }).then((response) => {
    if (response.status === 400) {
      // Обрабатываем ошибку 400 (например, неверный логин или пароль)
      // Получаем сообщение об ошибке от сервера
      return response.json().then((errorData) => {
        // Используем сообщение от сервера, если оно есть, иначе дефолтное
        throw new Error(errorData?.error || "Неверный логин или пароль");
      });
    }
    if (!response.ok) {
      // Обрабатываем другие HTTP ошибки
      throw new Error("Ошибка при входе");
    }
    // Если всё ОК, возвращаем данные пользователя
    return response.json();
  });
}

/**
 * Добавление нового поста.
 * @param {Object} params
 * @param {string} params.token - Токен авторизации (обязательно).
 * @param {string} params.description - Описание поста.
 * @param {string} params.imageUrl - URL изображения.
 * @returns {Promise<Object>} - Результат операции.
 */
export function addPost({ token, description, imageUrl }) {
  console.log("API: Отправляем данные на сервер:", { description, imageUrl });

  // ВАЖНО: Для этого конкретного эндпоинта НЕ НУЖНО указывать Content-Type: application/json
  // Согласно ошибке сервера: "В заголовке передан content-type: application/json, но эта API не умеет работать с этим заголовком, уберите его"
  return fetch(postsHost, {
    method: "POST",
    headers: {
      // Убираем "Content-Type": "application/json",
      // Токен авторизации обязателен
      Authorization: token,
    },
    body: JSON.stringify({
      description: description || "",
      imageUrl: imageUrl || "",
    }),
  }).then((response) => {
    if (response.status === 401) {
      // Обрабатываем ошибку 401 (нет авторизации)
      throw new Error("Нет авторизации");
    }
    if (response.status === 400) {
      // Обрабатываем ошибку 400 (например, не переданы обязательные данные)
      // Получаем детальное сообщение об ошибке от сервера
      return response.json().then((errorData) => {
        console.error("API: Ошибка 400 от сервера:", errorData);
        // Используем сообщение от сервера, если оно есть, иначе дефолтное
        throw new Error(errorData?.error || "Не переданы обязательные данные");
      });
    }
    if (!response.ok) {
      // Обрабатываем другие HTTP ошибки
      throw new Error("Ошибка при добавлении поста");
    }
    // Если всё ОК, возвращаем результат
    return response.json();
  });
}

/**
 * Загрузка изображения.
 * @param {Object} params
 * @param {File} params.file - Файл изображения.
 * @returns {Promise<Object>} - Данные загрузки (включая URL).
 */
export function uploadImage({ file }) {
  // Для загрузки файлов используется FormData, Content-Type НЕ нужен
  // (браузер сам установит правильный Content-Type с boundary)
  const data = new FormData();
  data.append("file", file);

  return fetch(baseHost + "/api/upload/image", {
    method: "POST",
    body: data,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((uploadResult) => {
      console.log("API: Полный ответ от uploadImage:", uploadResult);
      return uploadResult;
    });
}

/**
 * Поставить лайк посту.
 * @param {Object} params
 * @param {string} params.token - Токен авторизации (обязательно).
 * @param {string} params.postId - ID поста.
 * @returns {Promise<Object>} - Обновленный пост.
 */
export function likePost({ token, postId }) {
  // Для POST без тела заголовок Content-Type НЕ нужен
  return fetch(`${postsHost}/${postId}/like`, {
    method: "POST",
    headers: {
      // Токен авторизации обязателен
      Authorization: token,
    },
  }).then((response) => {
    if (response.status === 401) {
      // Обрабатываем ошибку 401 (нет авторизации)
      throw new Error("Нет авторизации");
    }
    if (!response.ok) {
      // Обрабатываем другие HTTP ошибки
      throw new Error("Ошибка при лайке");
    }
    // Если всё ОК, возвращаем обновленный пост
    return response.json();
  });
}

/**
 * Убрать лайк с поста.
 * @param {Object} params
 * @param {string} params.token - Токен авторизации (обязательно).
 * @param {string} params.postId - ID поста.
 * @returns {Promise<Object>} - Обновленный пост.
 */
export function dislikePost({ token, postId }) {
  // Для POST без тела заголовок Content-Type НЕ нужен
  return fetch(`${postsHost}/${postId}/dislike`, {
    method: "POST",
    headers: {
      // Токен авторизации обязателен
      Authorization: token,
    },
  }).then((response) => {
    if (response.status === 401) {
      // Обрабатываем ошибку 401 (нет авторизации)
      throw new Error("Нет авторизации");
    }
    if (!response.ok) {
      // Обрабатываем другие HTTP ошибки
      throw new Error("Ошибка при дизлайке");
    }
    // Если всё ОК, возвращаем обновленный пост
    return response.json();
  });
}

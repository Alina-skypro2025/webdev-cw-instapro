// api.js
const personalKey = "prod";
const baseHost = "https://wedev-api.sky.pro";
const postsHost = `${baseHost}/api/v1/${personalKey}/instapro`;

/**
 * Получить список всех постов.
 * @param {Object} params
 * @param {string} [params.token] - Токен авторизации (для получения состояния isLiked).
 * @returns {Promise<Array>} - Массив постов.
 */
export function getPosts({ token }) {
  const headers = {};

 
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
  const headers = {};


  if (token) {
    headers.Authorization = token;
  }

  return fetch(`${postsHost}/user-posts/${userId}`, {
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
  return fetch(baseHost + "/api/user", {
    method: "POST",
  
    headers: {},
    body: JSON.stringify({
      login,
      password,
      name,
      imageUrl,
    }),
  }).then((response) => {
    if (response.status === 400) {
      return response.json().then((errorData) => {
         throw new Error(errorData?.error || "Такой пользователь уже существует");
      });
    }
    if (!response.ok) {
      throw new Error("Ошибка при регистрации");
    }
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
  return fetch(baseHost + "/api/user/login", {
    method: "POST",
 
    headers: {},
    body: JSON.stringify({
      login,
      password,
    }),
  }).then((response) => {
    if (response.status === 400) {
      return response.json().then((errorData) => {
         throw new Error(errorData?.error || "Неверный логин или пароль");
      });
    }
    if (!response.ok) {
      throw new Error("Ошибка при входе");
    }
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

  return fetch(postsHost, {
    method: "POST",
    headers: {
     
      Authorization: token,
    },
    body: JSON.stringify({
      description: description || "",
      imageUrl: imageUrl || "",
    }),
  }).then((response) => {
    if (response.status === 401) {
      throw new Error("Нет авторизации");
    }
    if (response.status === 400) {
      return response.json().then((errorData) => {
        console.error("API: Ошибка 400 от сервера:", errorData);
        throw new Error(errorData?.error || "Не переданы обязательные данные");
      });
    }
    if (!response.ok) {
      throw new Error("Ошибка при добавлении поста");
    }
    return response.json();
  });
}

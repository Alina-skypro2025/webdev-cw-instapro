// Замени на свой, чтобы получить независимый от других набор данных.
// "боевая" версия инстапро лежит в ключе prod
const personalKey = "prod";
const baseHost = "https://wedev-api.sky.pro"; // Исправлено: убраны лишние пробелы
const postsHost = `${baseHost}/api/v1/${personalKey}/instapro`;

// Функция для проверки ответа от сервера
function checkResponse(response) {
  if (!response.ok) {
    return response.text().then((text) => {
      throw new Error(`Ошибка сервера: ${response.status} ${text}`);
    });
  }
  return response.json();
}

export function getPosts({ token }) {
  const headers = token ? { Authorization: token } : {};
  
  return fetch(postsHost, {
    method: "GET",
    headers,
  })
    .then(checkResponse)
    .then((data) => {
      return data.posts;
    });
}

// Получить посты конкретного пользователя
export function getUserPosts({ token, userId }) {
  const headers = token ? { Authorization: token } : {};
  
  return fetch(`${postsHost}/user-posts/${userId}`, {
    method: "GET",
    headers,
  })
    .then(checkResponse)
    .then((data) => {
      return data.posts;
    });
}

export function registerUser({ login, password, name, imageUrl }) {
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
  })
  .then((response) => {
    if (response.status === 400) {
      return response.json().then((data) => {
        throw new Error(data.error || "Такой пользователь уже существует");
      });
    }
    if (!response.ok) {
      throw new Error(`Ошибка регистрации: ${response.status}`);
    }
    return response.json();
  });
}

export function loginUser({ login, password }) {
  const params = new URLSearchParams();
  params.append('login', login);
  params.append('password', password);

  return fetch(baseHost + "/api/user/login", {
    method: "POST",
    // Не указываем Content-Type — браузер сам установит application/x-www-form-urlencoded
    body: params,
  })
  .then((response) => {
    if (response.status === 400) {
      return response.json().then((data) => {
        throw new Error(data.error || "Неверный логин или пароль");
      });
    }
    if (!response.ok) {
      throw new Error(`Ошибка входа: ${response.status}`);
    }
    return response.json();
  });
}

// Загружает картинку в облако, возвращает url загруженной картинки
export function uploadImage({ file }) {
  const data = new FormData();
  data.append("file", file);

  return fetch(baseHost + "/api/upload/image", {
    method: "POST",
    body: data,
  })
  .then(checkResponse);
}

// Добавить новый пост
export function addPost({ token, description, imageUrl }) {
  return fetch(postsHost, {
    method: "POST",
    headers: {
      Authorization: token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      description,
      imageUrl,
    }),
  })
  .then(checkResponse);
}

// Поставить лайк
export function likePost({ token, postId }) {
  return fetch(`${postsHost}/${postId}/like`, {
    method: "POST",
    headers: {
      Authorization: token,
    },
  })
  .then(checkResponse);
}

// Убрать лайк
export function dislikePost({ token, postId }) {
  return fetch(`${postsHost}/${postId}/dislike`, {
    method: "POST",
    headers: {
      Authorization: token,
    },
  })
  .then(checkResponse);
}

// Удалить пост
export function deletePost({ token, postId }) {
  return fetch(`${postsHost}/${postId}`, {
    method: "DELETE",
    headers: {
      Authorization: token,
    },
  })
  .then(checkResponse);
}


const personalKey = "prod";
const baseHost = "https://wedev-api.sky.pro"; // Исправлено: Удалены пробелы
const postsHost = `${baseHost}/api/v1/${personalKey}/instapro`;


export function getPosts({ token }) {
  const headers = {
    "Content-Type": "application/json",
  };


  if (token) {
    headers.Authorization = token;
  }

  return fetch(postsHost, {
    method: "GET",
    headers,
  })
    .then((response) => {
      
      if (response.status === 400) {
        
        return response.json().then((errorData) => {
          throw new Error(`Bad Request: ${errorData?.error || 'Invalid request'}`);
        });
      }
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
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


export function loginUser({ login, password }) {
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


export function uploadImage({ file }) {
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
    });
}


export function addPost({ token, description, imageUrl }) {
  console.log("API: Отправляем данные на сервер:", { description, imageUrl });

  return fetch(postsHost, {
    method: "POST",
    headers: {
      
      "Content-Type": "application/json",
     
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


export function getUserPosts({ token, userId }) {
  const headers = {
    "Content-Type": "application/json",
  };

  
  if (token) {
    headers.Authorization = token;
  }

  return fetch(`${postsHost}/user-posts/${userId}`, {
    method: "GET",
    headers,
  })
    .then((response) => {
    
      if (response.status === 400) {
        return response.json().then((errorData) => {
          throw new Error(`Bad Request: ${errorData?.error || 'Invalid request'}`);
        });
      }
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      return data.posts;
    });
}


export function likePost({ token, postId }) {
  return fetch(`${postsHost}/${postId}/like`, {
    method: "POST",
    headers: {
      Authorization: token,
    },
  }).then((response) => {
    if (response.status === 401) {
      throw new Error("Нет авторизации");
    }
    if (!response.ok) {
      throw new Error("Ошибка при лайке");
    }
    return response.json();
  });
}


export function dislikePost({ token, postId }) {
  return fetch(`${postsHost}/${postId}/dislike`, {
    method: "POST",
    headers: {
      Authorization: token,
    },
  }).then((response) => {
    if (response.status === 401) {
      throw new Error("Нет авторизации");
    }
    if (!response.ok) {
      throw new Error("Ошибка при дизлайке");
    }
    return response.json();
  });
}

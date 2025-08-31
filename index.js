import {
  getPosts,
  getUserPosts,
  addPost,
  likePost,
  dislikePost,
  deletePost,
} from "./api.js";
import { renderAddPostPageComponent } from "./components/add-post-page-component.js";
import { renderAuthPageComponent } from "./components/auth-page-component.js";
import {
  ADD_POSTS_PAGE,
  AUTH_PAGE,
  LOADING_PAGE,
  POSTS_PAGE,
  USER_POSTS_PAGE,
} from "./routes.js";
import { renderPostsPageComponent } from "./components/posts-page-component.js";
import { renderLoadingPageComponent } from "./components/loading-page-component.js";
import { renderUserPostsPageComponent } from "./components/user-posts-page-component.js";
import {
  getUserFromLocalStorage,
  removeUserFromLocalStorage,
  saveUserToLocalStorage,
} from "./helpers.js";

export let user = getUserFromLocalStorage();
export let page = null;
export let posts = [];

const getToken = () => {
  const token = user ? `Bearer ${user.token}` : undefined;
  return token;
};

export const setUser = (newUser) => {
  user = newUser;
  saveUserToLocalStorage(user);
  goToPage(POSTS_PAGE);
};

export const logout = () => {
  user = null;
  removeUserFromLocalStorage();
  goToPage(POSTS_PAGE);
};

// Функция для показа уведомлений
export const showNotification = (message) => {
  const notification = document.createElement("div");
  notification.className = "notification";
  notification.textContent = message;
  document.body.appendChild(notification);
  setTimeout(() => notification.remove(), 3000);
};

/**
 * Включает страницу приложения
 */
export const goToPage = (newPage, data) => {
  if (
    [
      POSTS_PAGE,
      AUTH_PAGE,
      ADD_POSTS_PAGE,
      USER_POSTS_PAGE,
      LOADING_PAGE,
    ].includes(newPage)
  ) {
    if (newPage === ADD_POSTS_PAGE) {
      /* Если пользователь не авторизован, то отправляем его на страницу авторизации перед добавлением поста */
      page = user ? ADD_POSTS_PAGE : AUTH_PAGE;
      return renderApp();
    }

    if (newPage === POSTS_PAGE) {
      page = LOADING_PAGE;
      renderApp();

      return getPosts({ token: getToken() })
        .then((newPosts) => {
          page = POSTS_PAGE;
          posts = newPosts;
          renderApp();
        })
        .catch((error) => {
          console.error(error);
          showNotification(`Ошибка загрузки постов: ${error.message}`);
          page = POSTS_PAGE;
          renderApp();
        });
    }

    if (newPage === USER_POSTS_PAGE) {
      page = LOADING_PAGE;
      renderApp();
      
      const token = getToken();
      getUserPosts({ token, userId: data.userId })
        .then((newPosts) => {
          page = USER_POSTS_PAGE;
          posts = newPosts;
          renderApp(data);
        })
        .catch((error) => {
          console.error("Error fetching user posts:", error);
          showNotification(`Ошибка загрузки постов пользователя: ${error.message}`);
          page = POSTS_PAGE;
          renderApp();
        });
      return;
    }

    page = newPage;
    renderApp();

    return;
  }

  throw new Error("страницы не существует");
};

const renderApp = (data = {}) => {
  const appEl = document.getElementById("app");
  
  if (page === LOADING_PAGE) {
    return renderLoadingPageComponent({
      appEl,
      user,
      goToPage,
    });
  }

  if (page === AUTH_PAGE) {
    return renderAuthPageComponent({
      appEl,
      setUser: (newUser) => {
        user = newUser;
        saveUserToLocalStorage(user);
        goToPage(POSTS_PAGE);
      },
      user,
      goToPage, // Передаем goToPage в компонент
    });
  }

  if (page === ADD_POSTS_PAGE) {
    return renderAddPostPageComponent({
      appEl,
      onAddPostClick({ description, imageUrl }) {
        if (!description.trim()) {
          showNotification("Введите описание поста");
          return;
        }
        if (!imageUrl) {
          showNotification("Загрузите изображение");
          return;
        }
        
        addPost({ token: getToken(), description, imageUrl })
          .then(() => {
            return getPosts({ token: getToken() });
          })
          .then((newPosts) => {
            posts = newPosts;
            goToPage(POSTS_PAGE);
            showNotification("Пост успешно добавлен!");
          })
          .catch((error) => {
            console.error("Error adding post:", error);
            showNotification(`Ошибка при добавлении поста: ${error.message}`);
          });
      },
    });
  }

  if (page === POSTS_PAGE) {
    return renderPostsPageComponent({
      appEl,
      posts,
      user,
      goToPage,
      likePost,
      dislikePost,
      deletePost,
    });
  }

  if (page === USER_POSTS_PAGE) {
    return renderUserPostsPageComponent({
      appEl,
      posts,
      user,
      userId: data.userId,
      goToPage,
      likePost,
      dislikePost,
    });
  }
};

goToPage(POSTS_PAGE);

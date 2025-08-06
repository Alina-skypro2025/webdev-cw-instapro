import {
  getPosts,
  addPost,
  getUserPosts,
  likePost,
  dislikePost,
} from "./api.js";

import { renderAddPostPageComponent } from "./components/add-post-page-component.js";
import { renderAuthPageComponent } from "./components/auth-page-component.js";
import { renderPostsPageComponent } from "./components/posts-page-component.js";
import { renderLoadingPageComponent } from "./components/loading-page-component.js";

import {
  ADD_POSTS_PAGE,
  AUTH_PAGE,
  LOADING_PAGE,
  POSTS_PAGE,
  USER_POSTS_PAGE,
} from "./routes.js";

import {
  getUserFromLocalStorage,
  removeUserFromLocalStorage,
  saveUserToLocalStorage,
} from "./helpers.js";

export let user = getUserFromLocalStorage();
export let page = null;
export let posts = [];

const getToken = () => {
  return user ? `Bearer ${user.token}` : undefined;
};

export const logout = () => {
  user = null;
  removeUserFromLocalStorage();
  goToPage(POSTS_PAGE);
};

const smoothPageTransition = (callback) => {
  const appEl = document.getElementById("app");
  const container = appEl.querySelector(".page-container");

  if (container) {
    container.classList.remove("active");
    setTimeout(() => {
      callback();
      setTimeout(() => {
        const newContainer = appEl.querySelector(".page-container");
        if (newContainer) {
          newContainer.classList.add("page-transition");
          setTimeout(() => {
            newContainer.classList.add("active");
          }, 10);
        }
      }, 10);
    }, 300);
  } else {
    callback();
  }
};

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
      page = user ? ADD_POSTS_PAGE : AUTH_PAGE;

      return renderAddPostPageComponent({
        appEl: document.getElementById("app"),
        onAddPostClick: ({ description, imageUrl }) => {
          const token = getToken();
          if (!token) {
            alert("Вы не авторизованы");
            goToPage(AUTH_PAGE);
            return;
          }

          addPost({
            token,
            description,
            imageUrl,
          })
            .then(() => {
              alert("Пост успешно добавлен!");
              goToPage(POSTS_PAGE);
            })
            .catch((error) => {
              console.error("Ошибка при добавлении поста:", error);
              alert("Не удалось добавить пост: " + error.message);
            });
        },
      });
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
          goToPage(POSTS_PAGE);
        });
    }

    if (newPage === USER_POSTS_PAGE) {
      page = LOADING_PAGE;
      renderApp();

      return getUserPosts({ token: getToken(), userId: data.userId })
        .then((userPosts) => {
          page = USER_POSTS_PAGE;
          posts = userPosts;
          renderApp();
        })
        .catch((error) => {
          console.error(error);
          goToPage(POSTS_PAGE);
        });
    }

    if (newPage === AUTH_PAGE) {
      page = AUTH_PAGE;
      renderApp();
      return;
    }

    page = newPage;
    renderApp();
    return;
  }

  throw new Error("Страницы не существует");
};

export const toggleLike = (postId, isLiked) => {
  const token = getToken();
  if (!token) {
    alert("Для оценки поста необходимо войти");
    goToPage(AUTH_PAGE);
    return Promise.resolve();
  }

  const likePromise = isLiked ? dislikePost : likePost;

  return likePromise({ token, postId })
    .then((responseData) => {
      const postIndex = posts.findIndex((post) => post.id === postId);
      if (postIndex !== -1) {
        posts[postIndex] = responseData.post;
        renderApp();
      }
    })
    .catch((error) => {
      console.error("Ошибка при работе с лайком:", error);
      alert("Не удалось выполнить действие: " + error.message);
    });
};

const renderApp = () => {
  const appEl = document.getElementById("app");

  switch (page) {
    case POSTS_PAGE:
      renderPostsPageComponent({ appEl });
      break;

    case AUTH_PAGE:
      renderAuthPageComponent({
        appEl,
        setUser: (newUser) => {
          user = newUser;
          saveUserToLocalStorage(user);
          goToPage(POSTS_PAGE);
        },
      });
      break;

    case ADD_POSTS_PAGE:
      renderAddPostPageComponent({
        appEl,
        onAddPostClick: ({ description, imageUrl }) => {
          const token = getToken();
          if (!token) {
            alert("Вы не авторизованы");
            goToPage(AUTH_PAGE);
            return;
          }

          addPost({
            token,
            description,
            imageUrl,
          })
            .then(() => {
              alert("Пост успешно добавлен!");
              goToPage(POSTS_PAGE);
            })
            .catch((error) => {
              console.error("Ошибка при добавлении поста:", error);
              alert("Не удалось добавить пост: " + error.message);
            });
        },
      });
      break;

    case USER_POSTS_PAGE:
      renderPostsPageComponent({ appEl });
      break;

    case LOADING_PAGE:
      renderLoadingPageComponent({ appEl });
      break;

    default:
      renderPostsPageComponent({ appEl });
      break;
  }
};


goToPage(POSTS_PAGE);

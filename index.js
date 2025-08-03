import { 
  getPosts, 
  addPost, 
  getUserPosts, 
  likePost, 
  dislikePost,
  uploadImage
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

export const logout = () => {
  user = null;
  removeUserFromLocalStorage();
  goToPage(POSTS_PAGE);
};


const smoothPageTransition = (callback) => {
  const appEl = document.getElementById("app");
  const container = appEl.querySelector('.page-container');
  
  if (container) {
    container.classList.remove('active');
    setTimeout(() => {
      callback();
      setTimeout(() => {
        const newContainer = appEl.querySelector('.page-container');
        if (newContainer) {
          newContainer.classList.add('page-transition');
          setTimeout(() => {
            newContainer.classList.add('active');
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
      return renderApp();
    }

    if (newPage === POSTS_PAGE) {
      page = LOADING_PAGE;
      renderApp();

      return getPosts({ token: getToken() })
        .then((newPosts) => {
          console.log("Посты из API:", newPosts);
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

    page = newPage;
    renderApp();

    return;
  }

  throw new Error("страницы не существует");
};


export const toggleLike = (postId, isLiked) => {
  const token = getToken();
  if (!token) {
    
    const appEl = document.getElementById("app");
    const container = appEl.querySelector('.page-container');
    
    if (container) {
      container.classList.remove('active');
      setTimeout(() => {
        goToPage(AUTH_PAGE);
      }, 300);
    } else {
      goToPage(AUTH_PAGE);
    }
    return Promise.resolve();
  }

  const likePromise = isLiked ? dislikePost : likePost;
  
  return likePromise({ token, postId })
    .then((responseData) => {
     
      const postIndex = posts.findIndex(post => post.id === postId);
      if (postIndex !== -1) {
        posts[postIndex] = responseData.post;
        
      
        updatePostInDOM(postId, responseData.post);
      }
    })
    .catch((error) => {
      console.error("Ошибка при работе с лайком:", error);
      alert("Не удалось выполнить действие: " + error.message);
    });
};


function updatePostInDOM(postId, updatedPost) {
  const postElement = document.querySelector(`.like-button[data-post-id="${postId}"]`);
  if (postElement) {

    const likeImage = postElement.querySelector('img');
    const newLikeImage = updatedPost.isLiked 
      ? "./assets/images/like-active.svg" 
      : "./assets/images/like-not-active.svg";
    likeImage.src = newLikeImage;
    
    const likesCountElement = postElement.closest('.post-likes').querySelector('.post-likes-text strong');
    if (likesCountElement) {
      likesCountElement.textContent = updatedPost.likes.length;
    }
    

    postElement.dataset.isLiked = updatedPost.isLiked;
  }
}

const renderApp = () => {
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
        smoothPageTransition(() => goToPage(POSTS_PAGE));
      },
      user,
      goToPage,
    });
  }

  if (page === ADD_POSTS_PAGE) {
    return renderAddPostPageComponent({
      appEl,
      onAddPostClick({ description, imageUrl }) {
        const token = getToken();
        if (!token) {
          smoothPageTransition(() => goToPage(AUTH_PAGE));
          return;
        }
        
      
        if (!description.trim()) {
          alert("Введите описание поста");
          return;
        }
        
        if (!imageUrl) {
          alert("Загрузите изображение");
          return;
        }
        
        addPost({ token, description, imageUrl })
          .then(() => {
            // После успешного добавления переходим к списку постов
            smoothPageTransition(() => goToPage(POSTS_PAGE));
          })
          .catch((error) => {
            console.error("Ошибка при добавлении поста:", error);
            alert("Не удалось добавить пост: " + error.message);
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
      toggleLike,
    });
  }

  if (page === USER_POSTS_PAGE) {
    return renderPostsPageComponent({
      appEl,
      posts,
      user,
      goToPage,
      toggleLike,
      isUserPostsPage: true,
    });
  }
};

goToPage(POSTS_PAGE);

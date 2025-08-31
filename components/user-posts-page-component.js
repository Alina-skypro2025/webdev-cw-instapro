import { renderHeaderComponent } from "./header-component.js";
import { POSTS_PAGE } from "../routes.js";
import { formatDistanceToNow } from "https://cdn.jsdelivr.net/npm/date-fns@2.29.3/esm/index.js";
import { ru } from "https://cdn.jsdelivr.net/npm/date-fns@2.29.3/esm/locale/index.js";

export function renderUserPostsPageComponent({ appEl, posts, user, userId, goToPage, likePost, dislikePost }) {
  const postsHtml = posts.map((post) => {
    const createDate = new Date(post.createdAt);
    const formattedDate = formatDistanceToNow(createDate, { addSuffix: true, locale: ru });
    
    return `
      <li class="post">
        <div class="post-header" data-user-id="${post.user.id}">
            <img src="${post.user.imageUrl}" class="post-header__user-image">
            <p class="post-header__user-name">${post.user.name}</p>
        </div>
        <div class="post-image-container">
          <img class="post-image" src="${post.imageUrl}" alt="Фото">
        </div>
        <div class="post-likes">
          <button data-post-id="${post.id}" class="like-button">
            <img src="${post.isLiked ? './assets/images/like-active.svg' : './assets/images/like-not-active.svg'}">
          </button>
          <p class="post-likes-text">
            Нравится: <strong>${post.likes.length}</strong>
          </p>
        </div>
        <p class="post-text">
          <span class="user-name">${post.user.name}</span>
          ${post.description}
        </p>
        <p class="post-date">
          ${formattedDate}
        </p>
      </li>
    `;
  }).join('');

  const appHtml = `
    <div class="page-container">
      <div class="header-container"></div>
      <div class="posts-user-header">
        <button class="back-button">Назад</button>
        <h3 class="user-name">${posts.length > 0 ? posts[0].user.name : 'Пользователь'}</h3>
      </div>
      <ul class="posts">
        ${postsHtml}
      </ul>
    </div>`;

  appEl.innerHTML = appHtml;

  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });

  // Обработчик кнопки "Назад"
  document.querySelector(".back-button").addEventListener("click", () => {
    goToPage(POSTS_PAGE);
  });

  // Обработчики лайков
  for (let likeEl of document.querySelectorAll(".like-button")) {
    likeEl.addEventListener("click", (event) => {
      event.stopPropagation();
      
      if (!user) {
        alert("Необходимо авторизоваться для установки лайков");
        goToPage(AUTH_PAGE);
        return;
      }
      
      const postId = likeEl.dataset.postId;
      const post = posts.find(p => p.id === postId);
      
      if (post.isLiked) {
        dislikePost({ token: `Bearer ${user.token}`, postId })
          .then((updatedPost) => {
            const postIndex = posts.findIndex(p => p.id === postId);
            if (postIndex !== -1) {
              posts[postIndex] = updatedPost.post;
            }
            renderUserPostsPageComponent({ appEl, posts, user, userId, goToPage, likePost, dislikePost });
          })
          .catch((error) => {
            console.error("Failed to dislike post:", error);
            alert("Не удалось убрать лайк. Попробуйте позже.");
          });
      } else {
        likePost({ token: `Bearer ${user.token}`, postId })
          .then((updatedPost) => {
            const postIndex = posts.findIndex(p => p.id === postId);
            if (postIndex !== -1) {
              posts[postIndex] = updatedPost.post;
            }
            renderUserPostsPageComponent({ appEl, posts, user, userId, goToPage, likePost, dislikePost });
          })
          .catch((error) => {
            console.error("Failed to like post:", error);
            alert("Не удалось поставить лайк. Попробуйте позже.");
          });
      }
    });
  }
}

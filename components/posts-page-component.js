import { USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage, user } from "../index.js";
import { formatDistanceToNow } from "https://cdn.jsdelivr.net/npm/date-fns@2.29.3/esm/index.js";
import { ru } from "https://cdn.jsdelivr.net/npm/date-fns@2.29.3/esm/locale/index.js";

export function renderPostsPageComponent({ appEl, posts, user, goToPage, likePost, dislikePost, deletePost }) {
  /**
   * @TODO: чтобы отформатировать дату создания поста в виде "19 минут назад"
   * можно использовать https://date-fns.org/v2.29.3/docs/formatDistanceToNow  
   */
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
          ${user && user.id === post.user.id ? `<button data-post-id="${post.id}" class="delete-button">Удалить</button>` : ''}
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
      <ul class="posts">
        ${postsHtml}
      </ul>
    </div>`;

  appEl.innerHTML = appHtml;

  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });

  // Обработчики кликов по пользователям
  for (let userEl of document.querySelectorAll(".post-header")) {
    userEl.addEventListener("click", () => {
      goToPage(USER_POSTS_PAGE, {
        userId: userEl.dataset.userId,
      });
    });
  }

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
            renderPostsPageComponent({ appEl, posts, user, goToPage, likePost, dislikePost, deletePost });
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
            renderPostsPageComponent({ appEl, posts, user, goToPage, likePost, dislikePost, deletePost });
          })
          .catch((error) => {
            console.error("Failed to like post:", error);
            alert("Не удалось поставить лайк. Попробуйте позже.");
          });
      }
    });
  }

  // Обработчики удаления постов
  for (let deleteEl of document.querySelectorAll(".delete-button")) {
    deleteEl.addEventListener("click", (event) => {
      event.stopPropagation();
      
      const postId = deleteEl.dataset.postId;
      
      if (confirm("Вы действительно хотите удалить этот пост?")) {
        deletePost({ token: `Bearer ${user.token}`, postId })
          .then(() => {
            // Удаляем пост из массива
            const postIndex = posts.findIndex(p => p.id === postId);
            if (postIndex !== -1) {
              posts.splice(postIndex, 1);
            }
            renderPostsPageComponent({ appEl, posts, user, goToPage, likePost, dislikePost, deletePost });
            // alert("Пост успешно удален"); // Уведомление уже показывается через showNotification
          })
          .catch((error) => {
            console.error("Failed to delete post:", error);
            alert("Не удалось удалить пост. Попробуйте позже.");
          });
      }
    });
  }
}

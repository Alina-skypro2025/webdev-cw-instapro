// components/posts-page-component.js
import { renderHeaderComponent } from "./header-component.js";
import { USER_POSTS_PAGE } from "../routes.js";
import { getToken, showNotification } from "../index.js";
import { AUTH_PAGE } from "../routes.js";

// Проверяем, доступна ли date-fns
const formatDistanceToNow = window.dateFns ? window.dateFns.formatDistanceToNow : null;
const ru = window.dateFns ? window.dateFns.ru : null;

function escapeHTML(str) {
  if (!str) return str;
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "<")
    .replace(/>/g, ">")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function renderPostsPageComponent({
  appEl,
  posts,
  user,
  goToPage,
  likePost,
  dislikePost,
  deletePost,
  userId,
}) {
  const renderPosts = () => {
    const postsHtml = posts
      .map((post) => {
        // Форматирование даты
        let createdAt = "Неизвестно";
        if (formatDistanceToNow && ru) {
          createdAt = formatDistanceToNow(new Date(post.createdAt), {
            addSuffix: true,
            locale: ru,
          });
        }
        return `
          <li class="post">
            <div class="post-header" data-user-id="${post.user.id}">
              <img src="${escapeHTML(post.user.imageUrl)}" class="post-header__user-image" alt="User avatar">
              <p class="post-header__user-name">${escapeHTML(post.user.name)}</p>
            </div>
            <div class="post-image-container">
              <img class="post-image" src="${escapeHTML(post.imageUrl)}" alt="Post image">
            </div>
            <div class="post-likes">
              <button data-post-id="${post.id}" class="like-button">
                <img src="./assets/images/like-${post.isLiked ? "active" : "not-active"}.svg">
              </button>
              <p class="post-likes-text">
                Нравится: <strong>${post.likes.length}</strong>
              </p>
            </div>
            <p class="post-text">
              <span class="user-name">${escapeHTML(post.user.name)}</span>
              ${escapeHTML(post.description)}
            </p>
            <p class="post-date">${createdAt}</p>
            ${
              user && post.user.id === user._id
                ? `<button class="delete-button" data-post-id="${post.id}">Удалить</button>`
                : ""
            }
          </li>`;
      })
      .join("");

    const appHtml = `
      <div class="page-container">
        <div class="header-container"></div>
        <ul class="posts">${postsHtml}</ul>
      </div>`;
    appEl.innerHTML = appHtml;

    renderHeaderComponent({
      element: document.querySelector(".header-container"),
      user,
      goToPage,
    });

    for (const userEl of document.querySelectorAll(".post-header")) {
      userEl.addEventListener("click", () => {
        goToPage(USER_POSTS_PAGE, { userId: userEl.dataset.userId });
      });
    }

    for (const likeButton of document.querySelectorAll(".like-button")) {
      likeButton.addEventListener("click", () => {
        const postId = likeButton.dataset.postId;
        const post = posts.find((p) => p.id === postId);
        const token = getToken();
        const action = post.isLiked ? dislikePost : likePost;
        if (!token) {
          goToPage(AUTH_PAGE);
          return;
        }
        action({ token, postId })
          .then(({ post: updatedPost }) => {
            const index = posts.findIndex((p) => p.id === postId);
            posts[index] = updatedPost;
            renderPosts(); // Перерисовываем компонент с обновленными данными
          })
          .catch((error) => {
            console.error("Error liking post:", error);
            showNotification(`Ошибка лайка: ${error.message}`);
          });
      });
    }

    for (const deleteButton of document.querySelectorAll(".delete-button")) {
      deleteButton.addEventListener("click", () => {
        const postId = deleteButton.dataset.postId;
        if (!confirm("Вы точно хотите удалить пост?")) return;
        deleteButton.disabled = true;
        deletePost({ token: getToken(), postId })
          .then(() => {
            posts = posts.filter((p) => p.id !== postId);
            renderPosts();
            showNotification("Пост удалён");
          })
          .catch((error) => {
            console.error("Error deleting post:", error);
            showNotification(`Ошибка удаления поста: ${error.message}`);
          })
          .finally(() => {
            deleteButton.disabled = false;
          });
      });
    }
  };
  renderPosts();
}

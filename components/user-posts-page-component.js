// components/user-posts-page-component.js
import { renderHeaderComponent } from "./header-component.js";
import { AUTH_PAGE } from "../routes.js";
import { showNotification } from "../index.js";

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

export function renderUserPostsPageComponent({
  appEl,
  userId,
  posts,
  user,
  goToPage,
  likePost,
  dislikePost,
}) {
  const renderUserPosts = () => {
    const appHtml = `
      <div class="page-container">
        <div class="header-container"></div>
        ${
          posts.length > 0
            ? `
          <div class="posts-user-header">
            <img src="${escapeHTML(posts[0].user.imageUrl)}" class="posts-user-header__user-image">
            <p class="posts-user-header__user-name">${escapeHTML(posts[0].user.name)}</p>
          </div>
        `
            : ""
        }
        <ul class="posts">
          ${posts
            .map(
              (post) => `
                <li class="post">
                  <div class="post-image-container">
                    <img class="post-image" src="${escapeHTML(post.imageUrl)}">
                  </div>
                  <div class="post-likes">
                    <button data-post-id="${post.id}" class="like-button">
                      <img src="./assets/images/${
                        post.isLiked ? "like-active.svg" : "like-not-active.svg"
                      }">
                    </button>
                    <p class="post-likes-text">
                      Нравится: <strong>${post.likes.length}</strong>
                    </p>
                  </div>
                  <p class="post-text">
                    <span class="user-name">${escapeHTML(post.user.name)}</span>
                    ${escapeHTML(post.description)}
                  </p>
                  <p class="post-date">
                    ${formatDistanceToNow ? formatDistanceToNow(new Date(post.createdAt), { locale: ru }) + " назад" : "Неизвестно"}
                  </p>
                </li>
              `
            )
            .join("")}
        </ul>
      </div>
    `;

    appEl.innerHTML = appHtml;

    renderHeaderComponent({
      element: document.querySelector(".header-container"),
      user,
      goToPage,
    });

    for (let likeBtn of document.querySelectorAll(".like-button")) {
      likeBtn.addEventListener("click", () => {
        if (!user) {
          showNotification("Авторизуйтесь для лайков");
          goToPage(AUTH_PAGE);
          return;
        }
        const postId = likeBtn.dataset.postId;
        const post = posts.find((p) => p.id === postId);
        const isLiked = post.isLiked;
        const action = isLiked ? dislikePost : likePost;
        action({ postId, token: `Bearer ${user.token}` })
          .then((response) => {
            const index = posts.findIndex((p) => p.id === postId);
            posts[index] = response.post;
            renderUserPosts(); // Перерисовываем компонент
          })
          .catch((error) => {
            console.error(error);
            showNotification("Ошибка при изменении лайка");
          });
      });
    }
  };

  renderUserPosts();
}

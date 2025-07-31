import { USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { formatDate } from "../date-utils.js";

export function renderPostsPageComponent({ appEl, posts, user, goToPage, toggleLike, isUserPostsPage = false }) {
  
  let pageHeader = '';
  if (isUserPostsPage && posts.length > 0) {
    const firstPost = posts[0];
    pageHeader = `
      <div class="posts-user-header">
        <img src="${firstPost.user.imageUrl}" class="posts-user-header__user-image" />
        <div class="posts-user-header__user-name">${firstPost.user.name}</div>
      </div>
    `;
  }

  const postsHtml = posts.map((post) => {
    const isLiked = post.isLiked;
    const likeImage = isLiked 
      ? "./assets/images/like-active.svg" 
      : "./assets/images/like-not-active.svg";
    
   
    const imageSrc = post.imageUrl && post.imageUrl.trim() !== '' 
      ? post.imageUrl 
      : "./assets/images/default-image.jpg";

    return `
      <li class="post">
        <div class="post-header" data-user-id="${post.user.id}">
          <img src="${post.user.imageUrl}" class="post-header__user-image" />
          <p class="post-header__user-name">${post.user.name}</p>
        </div>
        <div class="post-image-container">
          <img class="post-image" src="${imageSrc}" onerror="this.src='./assets/images/default-image.jpg'">
        </div>
        <div class="post-likes">
          <button data-post-id="${post.id}" data-is-liked="${isLiked}" class="like-button">
            <img src="${likeImage}">
          </button>
          <p class="post-likes-text">
            Нравится: <strong>${post.likes.length}</strong>
          </p>
        </div>
        <p class="post-text">
          <span class="user-name">${post.user.name}</span>
          ${post.description || ''}
        </p>
        <p class="post-date">
          ${formatDate(post.createdAt)}
        </p>
      </li>
    `;
  }).join("");

  const appHtml = `
    <div class="page-container">
      <div class="header-container"></div>
      ${pageHeader}
      <ul class="posts">
        ${postsHtml || '<p>Постов пока нет</p>'}
      </ul>
    </div>
  `;

  appEl.innerHTML = appHtml;

  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });


  document.querySelectorAll(".post-header").forEach(userEl => {
    userEl.addEventListener("click", () => {
      goToPage(USER_POSTS_PAGE, {
        userId: userEl.dataset.userId,
      });
    });
  });


  document.querySelectorAll('.like-button').forEach(button => {
    button.addEventListener('click', (event) => {
      event.stopPropagation(); 
      const postId = button.dataset.postId;
      const isLiked = button.dataset.isLiked === 'true';
      
     
      button.dataset.isLiked = !isLiked;
      
      toggleLike(postId, isLiked);
    });
  });

 
}

import { USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";


function simpleFormatDate(dateString) {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const timeDiff = now - date;
    const minutes = Math.floor(timeDiff / (1000 * 60));
    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

    if (minutes < 1) {
      return "менее минуты назад";
    } else if (minutes < 60) {
      return `${minutes} ${getMinutesWord(minutes)} назад`;
    } else if (hours < 24) {
      return `${hours} ${getHoursWord(hours)} назад`;
    } else {
      return `${days} ${getDaysWord(days)} назад`;
    }
  } catch (e) {
    return "недавно";
  }
}


function getMinutesWord(minutes) {
  const lastDigit = minutes % 10;
  const lastTwoDigits = minutes % 100;
  
  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
    return "минут";
  }
  
  switch (lastDigit) {
    case 1: return "минуту";
    case 2:
    case 3:
    case 4: return "минуты";
    default: return "минут";
  }
}

function getHoursWord(hours) {
  const lastDigit = hours % 10;
  const lastTwoDigits = hours % 100;
  
  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
    return "часов";
  }
  
  switch (lastDigit) {
    case 1: return "час";
    case 2:
    case 3:
    case 4: return "часа";
    default: return "часов";
  }
}

function getDaysWord(days) {
  const lastDigit = days % 10;
  const lastTwoDigits = days % 100;
  
  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
    return "дней";
  }
  
  switch (lastDigit) {
    case 1: return "день";
    case 2:
    case 3:
    case 4: return "дня";
    default: return "дней";
  }
}

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
          ${simpleFormatDate(post.createdAt)}
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
      const userId = userEl.dataset.userId;
      if (userId) {
        goToPage(USER_POSTS_PAGE, {
          userId: userEl.dataset.userId,
        });
      }
    });
  });


  document.querySelectorAll('.like-button').forEach(button => {
    button.addEventListener('click', (event) => {
      event.stopPropagation();
      
    
      button.classList.add('liked');
      setTimeout(() => {
        button.classList.remove('liked');
      }, 300);
      
      const postId = button.dataset.postId;
      const isLiked = button.dataset.isLiked === 'true';
      
      button.dataset.isLiked = !isLiked;
      
      if (typeof toggleLike === 'function') {
        toggleLike(postId, isLiked);
      }
    });
  });

  
  const container = document.querySelector('.page-container');
  if (container) {
    container.classList.add('page-transition');
    setTimeout(() => {
      container.classList.add('active');
    }, 10);
  }
}

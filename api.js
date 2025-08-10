
const API_URL = "https://webdev-hw-api.vercel.app/api/v1/prod/instapro";

let token = localStorage.getItem("instaproToken") || "";

export const setToken = (t) => {
  token = t;
  localStorage.setItem("instaproToken", t);
};

const authHeaders = () => ({
  "Authorization": Bearer ${token},
  "Content-Type": "application/json", 
});


export async function getPosts() {
  const resp = await fetch(API_URL, {
    method: "GET",
    headers: { "Authorization": Bearer ${token} },
  });
  if (!resp.ok) throw new Error(`Ошибка загрузки постов: ${resp.status}`);
  const data = await resp.json();
  return data.posts || data; 
}


export async function addPost({ description, imageUrl }) {

  const body = JSON.stringify({ description, imageUrl }); 

  const resp = await fetch(API_URL, {
    method: "POST",
    headers: authHeaders(), 
    body,
  });

  if (resp.status === 401) {
    throw new Error("Не авторизовано. Проверьте токен.");
  }
  if (!resp.ok) {
    const text = await resp.text().catch(() => "");
    throw new Error(text || `Ошибка добавления поста: ${resp.status}`);
  }
  return resp.json();
}


export async function likePost(postId) {
  const resp = await fetch(`${API_URL}/${postId}/like`, {
    method: "POST",
    headers: { "Authorization": Bearer ${token} },
  });
  if (!resp.ok) throw new Error(`Не удалось поставить лайк: ${resp.status}`);
  return resp.json();
}


export async function unlikePost(postId) {
  const resp = await fetch(`${API_URL}/${postId}/like`, {
    method: "DELETE",
    headers: { "Authorization": Bearer ${token} },
  });
  if (!resp.ok) throw new Error(`Не удалось снять лайк: ${resp.status}`);
  return resp.json();
}

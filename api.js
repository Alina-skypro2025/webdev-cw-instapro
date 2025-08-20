
export function addPost({ token, description, imageUrl }) {
  console.log("API: Отправляем данные на сервер:", { description, imageUrl });

  return fetch(postsHost, {
    method: "POST",
    headers: {

      Authorization: token,
    },
    body: JSON.stringify({
      description: description || "",
      imageUrl: imageUrl || "",
    }),
  }).then((response) => {
    if (response.status === 401) {
      throw new Error("Нет авторизации");
    }
    if (response.status === 400) {
      return response.json().then((errorData) => {
        console.error("API: Ошибка 400 от сервера:", errorData);
        throw new Error(errorData?.error || "Не переданы обязательные данные");
      });
    }
    if (!response.ok) {
      throw new Error("Ошибка при добавлении поста");
    }
    return response.json();
  });
}

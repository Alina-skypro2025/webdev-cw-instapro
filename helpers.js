
export function saveUserToLocalStorage(user) {
  
  if (!user || !user.token || !user.name || !user.id) {
    console.warn("Helpers: Попытка сохранить некорректного пользователя в localStorage.", user);
    return;
  }

  try {
    window.localStorage.setItem("user", JSON.stringify(user));
    console.log("Helpers: Пользователь успешно сохранен в localStorage.");
  } catch (e) {
    console.error("Helpers: Ошибка сохранения пользователя в localStorage:", e);
  }
}


export function getUserFromLocalStorage() {
  try {
    const userStr = window.localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
    
      if (user && user.token && user.name && user.id) {
        console.log("Helpers: Пользователь успешно получен из localStorage.");
        return user;
      } else {
        console.warn("Helpers: Некорректные данные пользователя в localStorage.", user);
        return null;
      }
    }
    return null;
  } catch (error) {
    console.error("Helpers: Ошибка получения пользователя из localStorage:", error);
    return null;
  }
}


export function removeUserFromLocalStorage() {
  try {
    window.localStorage.removeItem("user");
    console.log("Helpers: Пользователь успешно удален из localStorage.");
  } catch (e) {
    console.error("Helpers: Ошибка удаления пользователя из localStorage:", e);
  }
}

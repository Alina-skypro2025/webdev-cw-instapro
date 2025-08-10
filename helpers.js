
export function saveUserToLocalStorage(user) {
  try {
    window.localStorage.setItem("user", JSON.stringify(user));
  } catch (e) {
    console.error("Helpers: Ошибка сохранения пользователя в localStorage:", e);
  }
}


export function getUserFromLocalStorage() {
  try {
    const userStr = window.localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error("Helpers: Ошибка получения пользователя из localStorage:", error);
    return null;
  }
}


export function removeUserFromLocalStorage() {
  try {
    window.localStorage.removeItem("user");
  } catch (e) {
    console.error("Helpers: Ошибка удаления пользователя из localStorage:", e);
  }
}

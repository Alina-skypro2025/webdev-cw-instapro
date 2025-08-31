
export function saveUserToLocalStorage(user) {
  // Проверяем, что пользователь существует и содержит все необходимые поля
  if (!user || !user.token || !user.name || user.id === undefined) {
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

/**
 * Получает объект пользователя из localStorage.
 * @returns {Object|null} - Объект пользователя или null, если не найден или ошибка.
 */
export function getUserFromLocalStorage() {
  try {
    const userStr = window.localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      // Проверяем, что пользователь содержит все необходимые поля
      if (user && user.token && user.name && user.id !== undefined) {
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

/**
 * Удаляет объект пользователя из localStorage.
 */
export function removeUserFromLocalStorage() {
  try {
    window.localStorage.removeItem("user");
    console.log("Helpers: Пользователь успешно удален из localStorage.");
  } catch (e) {
    console.error("Helpers: Ошибка удаления пользователя из localStorage:", e);
  }
}

/**
 * Сохраняет объект пользователя в localStorage.
 * @param {Object|null} user - Объект пользователя для сохранения.
 */
export function saveUserToLocalStorage(user) {
  // Проверка на null или undefined перед сериализацией.
  if (user === null || user === undefined) {
    console.warn("Helpers: Попытка сохранить пустого пользователя в localStorage.");
    // Удаляем запись, если передан null/undefined
    removeUserFromLocalStorage();
    return;
  }

  try {
    // Проверка, что user является объектом
    if (typeof user === 'object' && user !== null && !Array.isArray(user)) {
       // Проверяем наличие обязательных полей перед сохранением.
       // id может быть 0, поэтому проверяем на !== undefined
       if (user.token && user.name && user.id !== undefined) {
         window.localStorage.setItem("user", JSON.stringify(user));
         console.log("Helpers: Пользователь успешно сохранен в localStorage.");
       } else {
         console.warn("Helpers: Объект пользователя не содержит всех обязательных полей (token, name, id).", user);
       }
    } else {
       console.warn("Helpers: Попытка сохранить некорректный объект пользователя.", user);
    }
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
    // Проверка, что строка не пустая и не "null"/"undefined"
    if (userStr && userStr !== "null" && userStr !== "undefined") {
      const user = JSON.parse(userStr);
      // Проверка корректности десериализованного объекта
      // id может быть 0, поэтому проверяем на !== undefined
      if (user && typeof user === 'object' && user.token && user.name && user.id !== undefined) {
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

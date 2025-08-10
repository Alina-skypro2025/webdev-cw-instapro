
export function saveUserToLocalStorage(user) {

  if (user === null || user === undefined) {
    console.warn("Helpers: Попытка сохранить пустого пользователя в localStorage.");
    removeUserFromLocalStorage();
    return;
  }

  try {
 
    if (typeof user === 'object' && user !== null && !Array.isArray(user)) {
      
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


export function getUserFromLocalStorage() {
  try {
    const userStr = window.localStorage.getItem("user");
 
    if (userStr && userStr !== "null" && userStr !== "undefined") {
      const user = JSON.parse(userStr);
     
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

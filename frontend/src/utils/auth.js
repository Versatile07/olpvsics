export const setToken = (token) => {
  localStorage.setItem("token", token);
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const logout = () => {
  localStorage.removeItem("token");
  window.location.href = "/";
};

export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

// Decode JWT payload without external library
export const decodeToken = () => {
  const token = getToken();
  if (!token) return null;

  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64).split('').map(c =>
        '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      ).join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

// Get user role from token
export const getRole = () => {
  const payload = decodeToken();
  return payload?.role || null;
};

// Get user ID from token
export const getUserId = () => {
  const payload = decodeToken();
  return payload?.userId || null;
};

// Check if user has specific role
export const hasRole = (roles) => {
  const userRole = getRole();
  if (Array.isArray(roles)) {
    return roles.includes(userRole);
  }
  return userRole === roles;
};

// @/lib/auth.js
export function getLoggedInUser() {
  if (typeof window === 'undefined') return null;
  
  try {
    // Check localStorage first (priority)
    const userFromBio = localStorage.getItem("bio-user");
    if (userFromBio) {
      const parsed = JSON.parse(userFromBio);
      // Make sure it has required fields
      if (parsed && (parsed._id || parsed.id || parsed.email)) {
        return parsed;
      }
    }
    
    // Fallback to "user" key
    const userFromUser = localStorage.getItem("user");
    if (userFromUser) {
      const parsed = JSON.parse(userFromUser);
      if (parsed && (parsed._id || parsed.id || parsed.email)) {
        return parsed;
      }
    }
    
    return null;
  } catch (error) {
    console.error("Error in getLoggedInUser:", error);
    return null;
  }
}


// export function getLoggedInUser() {
//   try {
//     const raw = localStorage.getItem("user");
//     return raw ? JSON.parse(raw) : null;
//   } catch {
//     return null;
//   }
// }

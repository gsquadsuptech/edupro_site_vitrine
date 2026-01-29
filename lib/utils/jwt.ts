export const decodeJWT = (token: string) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error('Error decoding JWT:', e);
        return null;
    }
};

export const isTokenExpired = (token: string) => {
    const decoded = decodeJWT(token);
    if (!decoded || !decoded.exp) return true;
    return decoded.exp * 1000 < Date.now();
};

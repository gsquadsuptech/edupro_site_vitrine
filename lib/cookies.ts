export const getAllCookies = () => {
    if (typeof document === 'undefined') return {};

    return document.cookie.split(';').reduce((cookies: Record<string, string>, cookie) => {
        const [name, value] = cookie.split('=').map(c => c.trim());
        if (name && value) {
            cookies[name] = decodeURIComponent(value);
        }
        return cookies;
    }, {});
};

export const getCookie = (name: string) => {
    const cookies = getAllCookies();
    return cookies[name] || null;
};

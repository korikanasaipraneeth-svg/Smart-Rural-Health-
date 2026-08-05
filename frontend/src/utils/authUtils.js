export const safeParseUser = () => {
    try {
        const item = localStorage.getItem('user');
        if (!item || item === 'undefined' || item === 'null') return null;
        return JSON.parse(item);
    } catch (e) {
        console.warn('Failed to parse user from localStorage', e);
        return null;
    }
};

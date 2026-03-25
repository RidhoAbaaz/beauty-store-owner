export const getMonthRange = () => {
    const now = new Date();

    const start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0).toISOString();
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 1, 0, 0, 0).toISOString();

    return {
        start,
        end
    };
};

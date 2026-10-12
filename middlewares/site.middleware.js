

export const addCurrentDate = (req, res, next) => {
    req.currentDate = new Date();
    next();
}

export const logGetRequestDate = (req, res, next) => {
    if (req.method === 'GET') {
        console.log(`[GET Request] current date and time: ${req.currentDate}`);
    }
    next();
}

export const blockOnShabbat = (startHour, endHour) => {
    return (req, res, next) => {
        const date = req.currentDate;
        const day = date.getDay();
        const hour = date.getHours();

        if ((day === 5 && hour >= startHour) || (day === 6 && hour <= endHour)) {
            return res.status(403).json({ error: "the site is bocked from friday noon until the end of  shabbat" })
        }
        next();
    }
}
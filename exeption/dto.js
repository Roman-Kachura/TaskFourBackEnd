class Dto {
    getDate(d) {
        const getCorrectNumber = (n) => n < 10 ? `0${n}` : n;
        const date = `${getCorrectNumber(d.getDate())}-${getCorrectNumber(d.getMonth())}-${getCorrectNumber(d.getFullYear())}`;
        const time = `${getCorrectNumber(d.getHours())}:${getCorrectNumber(d.getMinutes())}:${getCorrectNumber(d.getSeconds())}`;
        return `${date} ${time}`
    }

    getUserData(u) {
        return {
            id: u.id,
            isBlocked: !!u.is_blocked,
            name: u.name,
            registered: this.getDate(u.reg_date),
            lastDate: this.getDate(u.last_date),
            email: u.email
        };
    }
    getAuthUserData(u){
        return{
            token:u.token,
            ...this.getUserData(u)
        }
    }
}

module.exports = new Dto();
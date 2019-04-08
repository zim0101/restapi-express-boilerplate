class CheckIfUser {

    static isUser (req, res, next) {
        if (req.user.type === "user") {
            console.log("-------------------------");
            console.log(req.user.type);
            console.log("-------------------------");
            next();
        } else {
            console.log("-------------------------");
            console.log("Type didn't match, TYPE: ", req.user.type);
            console.log("-------------------------");
            res.redirect('/api/sign-in');
        }
    }

}

module.exports = CheckIfUser.isUser;
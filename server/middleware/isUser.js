
// import model from '../models';
// const {User} = model;
function isUser (req, res, next) {
    if (req.user.type === "user") {
        next();
    } else {
        res.redirect('/api/sign-in');
    }
    
}

module.exports = isUser;

import Users from '../controllers/user';


export default async function isUser(request, _response, next) {
    var username = request.body.username;
    var type = await Users.userType(username);
    if(type === "user") {
        next();
    } else {
        response.status(403).json({message: "Forbidden"});
    }
}
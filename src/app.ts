import  express, { Request, Response }  from "express";
import jwt, { TokenExpiredError }  from "jsonwebtoken";
import config from './config.json';
const app = express();

app.use(express.json());


interface TokenList {
    [key: string]: {
        "status": string,
        "token": string,
        "refreshToken": string,
    }
}
const tokenList: TokenList = {}

app.post("/auth", (request: Request, response: Response) => {
    const {email, password} = request.body;

    const user = {
        email,
        password
    }

    const token = jwt.sign(user, config.secret, { expiresIn: config.tokenLife})

    const refreshToken = jwt.sign(user, config.refreshTokenSecret, { expiresIn: 100})

    const responseToken = {
        "status": "Logged in",
        "token": token,
        "refreshToken": refreshToken,
    }

    return response.status(200).json(responseToken)

})

app.post("/verifyAuth", (request: Request, response: Response) => {
    const token = request.headers.authorization?.split("Bearer ")[1] as string
    
    const validate = jwt.verify(token, config.refreshTokenSecret,(error, decoded) => {
        console.log(error)
        if(error instanceof TokenExpiredError) {
            return response.status(404).json({
                msg: 'Token is expired'
            })
        }

        return response.status(200).json({
            msg: "Token is valid"
        });
    })

    
    

    
})

export default app;

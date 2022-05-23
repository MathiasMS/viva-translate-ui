import { useDispatch } from "react-redux";
import { useLoginMutation, ILoginRequest } from "./authentication.service";
import { login as loginAction } from "./authentication.slice";
import {useNavigate} from "react-router-dom";
import {notifyErrors} from "../../utils/error";
import {setAuthData} from "../../utils/authentication";

export const useLogin = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const [loginMutation] = useLoginMutation();

    const login = async (credentials: ILoginRequest, rememberMe: boolean) => {
        try {
            const response = await loginMutation(credentials).unwrap();

            if(response){
                const { user: { _id, username}, token } = response;

                dispatch(loginAction({ user: { username, _id }, token }));
                if(rememberMe){
                    setAuthData({ user: { username, _id }, token, isLogged: true })
                }
                navigate('/quizzes')
            }
        } catch(error: any){
            console.log(error)
            const { data } = error
            notifyErrors(data)
        }
    };

    return { login };
};

export default useLogin;

import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import {logout as logoutAction} from "./authentication.slice";
import {removeAuthData} from "../../utils/authentication";
import {notifyErrors} from "../../utils/error";

export const useLogout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate()

    const logout = async () => {
       try {
           await dispatch(logoutAction())
           await removeAuthData()
           navigate("/login")
       } catch(error: any){
           console.log(error)
           const { data } = error
           notifyErrors(data)
       }
    };

    return { logout };
}

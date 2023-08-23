import { Redirect } from "react-router-dom";
import { useOktaAuth } from "@okta/okta-react";
import { Loading } from "../layouts/Utils/Loading";
import OktaSignInWidget from "./OktaSigninWidget";

const LoginWidget = ({config}) =>{

        const  {oktaAuth, authState } = useOktaAuth();
        const onSuccess = (tokens) => {
            oktaAuth.handleLoginRedirect(tokens);
        };
        
        const onError = (err) =>{
                console.log('Sign in Error :', err);

        }

        if(!authState){
            return(
            <Loading/>



            );
        }

        return authState.isAuthenticated ?
        <Redirect to= {{pathname: '/' }}/>
            :
            <OktaSignInWidget config = {config} onSuccess={onSuccess} onError={onError}/>;




};
export default LoginWidget;
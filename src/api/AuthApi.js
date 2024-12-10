import instance from '../axios/auth-axios';

class AuthApi {

    static authenticate(loginRequest) {
        return instance.post('/authenticate', loginRequest);
    }
}

export default AuthApi;
import instance from '../axios/auth-axios';

class AuthApi {

    static login(loginRequest) {
        return instance.post('/auth/login', loginRequest);
    }

    static getUserProfile() {
        return instance.get(`/profiles/${window.env.APPLICATION_NAME}`);
    }
}

export default AuthApi;
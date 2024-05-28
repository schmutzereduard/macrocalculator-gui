import instance from '../axios/request-axios';

class MacroCalculatorApi {
    static getFoods() {
        return instance.get('/foods');
    }
}

export default MacroCalculatorApi;

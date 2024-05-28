import instance from '../axios/instance';

class MacroCalculatorApi {
    static getFoods() {
        return instance.get('/foods');
    }
}

export default MacroCalculatorApi;

// api/MacroCalculatorAPI.js

import instance from '../axios/request-axios';

class MacroCalculatorApi {
    static getFoods() {
        return instance.get('/foods');
    }

    static addFood(food) {
        return instance.post('/foods', food);
    }

    static updateFood(food) {
        return instance.put('/foods', food);
    }

    static deleteFood(id) {
        return instance.delete(`/foods/${id}`);
    }

    static getFoodTypes() {
        return instance.get('/food-types');
    }
}

export default MacroCalculatorApi;

import instance from '../axios/request-axios';

class MacroCalculatorApi {
    static getFoods() {
        return instance.get('/foods');
    }

    static getFood(id) {
        return instance.get(`/foods/${id}`);
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

    static getAllMeals() {
        return instance.get('/meals');
    }

    static getMeal(id) {
        return instance.get(`/meals/${id}`);
    }

    static addMeal(meal) {
        return instance.post('/meals', meal);
    }

    static updateMeal(meal) {
        return instance.put('/meals', meal);
    }

    static deleteMeal(id) {
        return instance.delete(`/meals/${id}`);
    }
}

export default MacroCalculatorApi;

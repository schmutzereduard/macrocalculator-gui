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

    static getAllRecipes() {
        return instance.get('/recipes');
    }

    static getRecipe(id) {
        return instance.get(`/recipes/${id}`);
    }

    static addRecipe(recipe) {
        return instance.post('/recipes', recipe);
    }

    static updateRecipe(recipe) {
        return instance.put('/recipes', recipe);
    }

    static deleteRecipe(id) {
        return instance.delete(`/recipes/${id}`);
    }
}

export default MacroCalculatorApi;

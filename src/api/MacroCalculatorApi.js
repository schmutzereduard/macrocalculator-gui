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

    static getPlans() {
        return instance.get('/plans');
    }


    static getMonthPlans(year, month) {
        return instance.get(`/plans/month?date=${year}-${month}`);
    }    

    static getDayPlan(year,month, day) {
        return instance.get(`/plans/day?date=${year}-${month}-${day}`);
    }    

    static addPlan(plan) {
        return instance.post('/plans', plan);
    }

    static updatePlan(plan) {
        return instance.put(`/plans`, plan);
    }

    static deletePlan(id) {
        return instance.delete(`/plans/${id}`);
    }
}

export default MacroCalculatorApi;

import { connect } from 'react-redux';
import { useEffect } from 'react'; // Import useEffect if you haven't already
import { fetchFoods } from '../store/actions/foodActions';

const Foods = ({ fetchFoods }) => {
    useEffect(() => {
        // Dispatch fetchFoods action when the component mounts
        fetchFoods();
    }, [fetchFoods]); // Add fetchFoods to the dependency array to avoid multiple dispatches

    // Your component logic here

}

const mapStateToProps = (state) => {
    console.log("state=" + JSON.stringify(state));
    
    // Map state values to props if needed
    return {};
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchFoods: () => dispatch(fetchFoods()) // Return an object with fetchFoods function
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Foods);

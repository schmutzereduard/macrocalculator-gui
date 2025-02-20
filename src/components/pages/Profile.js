import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchProfile } from "../../store/authSlice";

function Profile() {

    const dispatch = useDispatch();
    const { profile, loading, error } = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(fetchProfile());
    }, [dispatch]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!profile) {
        return <div>No profile data available.</div>;
    }

    return (
        <div>
            <h1>Welcome, { profile.id }</h1>
            <p>Calorie Goal: {profile.calorieGoal}</p>
            {/* Render other profile details */}
        </div>
    );
}

export default Profile;

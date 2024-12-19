import React, {useEffect} from 'react';
import Navbar from "../app/Navbar";
import { useDispatch } from "react-redux";

function Home() {

    const dispatch = useDispatch();

    useEffect(() => {

    }, []);

    return (
        <div>
            <Navbar/>
            <h1>Home Page</h1>
        </div>
    );
}

export default Home;

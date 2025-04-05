import React, { useState } from 'react'
import axios from axios

const Home = () => {
    // Api request using react
    const [users,setUsers] = useState({})
    // Example Fetches all users
    useEffect(()=> {
        const fetchAllUsers = async() => {
            try{
                const res = await axios.get("https://localhost:8800/home")
                console.log(res)
            }catch(err){
                console.log(err)
            }
        }
        fetchAllUsers()
    },[])

    return (
        <div>
           Home          
        </div>
    )
}

export default Home

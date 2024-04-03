import React from 'react'

const Login = () => {
    return (
        <>
        <div className="bg-[#989696] h-screen flex justify-center items-center">
            <div className="container bg-white flex flex-col w-96 p-8 rounded h-3/7 justify-between items-center">
                <h2 className='text-black font-bold'>log in</h2>
                <form className='flex-col items-center'>
                    <input className="p-3 border rounded mt-2 w-full" type="text" placeholder="Username" />
                    
                    <input className="p-3 border rounded mt-2 w-full" type="password" placeholder="Password" />
                    
                    <button className="bg-white text-blue-500 p-2 border rounded mt-5">Login</button>
                </form>
            </div>
        </div>
        </>
        
    )
}

export default Login
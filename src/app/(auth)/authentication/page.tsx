"use client"

import Login from "@/components/Login"
import Signup from "@/components/Signup"
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux"
import { logIn, signUp } from "@/store/slices/global.slice"
import { ShieldCheck, Tag } from "lucide-react"



function Auth() {

  const dispatch = useAppDispatch()
  const {authTabChanger} = useAppSelector((state) => state.global)
  
  return (
    <div className="w-full h-screen flex flex-wrap justify-center items-center bg-linear-to-tr from-red-500 via-red-200 to-cyan-500 ">
      <div className="bg-white/40 backdrop-blur-md w-[60%] h-[70%] flex flex-wrap justify-between">
        <div className="w-[50%] h-full p-14 bg-red-800">
          <h2 className="text-white text-[55px]/18 font-bold">Welcome Back to First Class Thinking.</h2>
          <p className="text-white/70 text-[30px] my-6">Access your personalized journey, loyalty rewards, and seamless travel management.</p>
          <div className="w-full p-4 flex items-center gap-5">
            <p className="text-white bg-white/20 p-5 rounded-full"><ShieldCheck size={30}/></p>
            <h3 className="text-white text-2xl font-semibold">Secure Authentication
              <p className="text-lg font-normal text-white/50">Multi-factor security protocols enebled</p>
            </h3>
          </div>
          <div className="w-full p-4 flex items-center gap-5">
            <p className="text-white bg-white/20 p-5 rounded-full"><Tag size={30}/></p>
            <h3 className="text-white text-2xl font-semibold">Nextfly Rewards
              <p className="text-lg font-normal text-white/50">Exclusive benefits for our members</p>
            </h3>
          </div>
        </div>

        <div className="w-[50%] p-5 flex flex-wrap gap-5 ">
          <div className="w-full flex flex-wrap gap-x-5 gap-y-2 p-5">
            <button onClick={() => dispatch(logIn("login"))} className={` ${authTabChanger === "login"? "text-red-700 font-semibold":"text-black font-light"} text-2xl`}>Sign In</button>
            <button onClick={() => dispatch(signUp("signup"))} className={` ${authTabChanger === "signup"? "text-red-700 font-semibold":"text-black font-light"} text-2xl`}>Sign Up</button>
            <div className="w-full relative">
              <div className={`${authTabChanger === "signup"? "left-22 w-22":"left-0 w-21"} transition-all duration-700 h-1 absolute bg-red-700`}></div>
            </div>
          </div>

          <div className="w-full h-150">
            {authTabChanger === "login"? (
              <Login/>
            ):(
              <Signup/>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Auth
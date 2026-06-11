import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
  authUser: null,
  isCheckingAuth : true,
  isSignIn : false,
  isLoggingIn: false,

  checkAuth : async ()=>{
    try{
        const res = await axiosInstance.get("/auth/check")
        set({authUser: res.data});
    } catch(error){
        console.error("An error occured while checking the authentication in useAuthStore.js : ", error);
        set({authUser:null});
    } finally{
        set({isCheckingAuth: false});
    }
  },
  signIn: async (data)=>{
    set({isSignIn:true});
    try{
        if(!data){
            return toast.error("User credentials missing..");
        }
        const res = await axiosInstance.post("/auth/signin",data);
        set({authUser: res.data});
        toast.success("User has been signed in.")
    }catch(error){
        // console.error(error);

        toast.error(
            error.response?.data?.message ||
            "Something went wrong"
        );

        set({authUser:null});
    } finally {
        set({isSignIn : false});
    }
  },
  
  login: async(data)=>{
    set({isLoggingIn:true});
    try{
        if(!data){
            return toast.error("User Credentials missing..");
        }
        const res = axiosInstance.post("/auth/login",data);
        set({authUser: res.data});
        toast.success("User has been logged in...");
    } catch(error){
        console.error(error);
        toast.error(error.response?.data?.message||
            "Something went wrong"
        );
    }finally{
        set({isLoggingIn:false});
    }
  }
  
}));
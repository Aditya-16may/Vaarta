import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import {useAuthStore} from "./useAuthStore";
import toast from "react-hot-toast";
import { io } from "socket.io-client";


export const useChatStore = create((set,get)=> ({
    allContacts: [],
    chats: [],
    messages : [],
    activeTab :"chats",
    selectedUser: null,
    isUserLoading: false,
    isMessagesLoading: false,
    isSoundEnabled: JSON.parse(localStorage.getItem("isSoundEnabled")) === true,

    toggleSound:()=>{
        localStorage.setItem("isSoundEnabled", !get().isSoundEnabled);
        set({isSoundEnabled : !get().isSoundEnabled})
    },

    setActiveTab: (tab)=> set({activeTab: tab}),
    setSelectedUser : (user)=> set({selectedUser: user}),

    setAllContacts : async()=>{
        set({isUserLoading:true});
        try{
            const res = await axiosInstance.get("/messages/contacts");
            set({allContacts:res.data.contacts});
        } catch(error){
            toast.error(error.response?.data?.message ||
                "Something went wrong.."
            );
        } finally{
            set({isUserLoading: false})
        }
    },

    setChats: async()=>{
        set({isUserLoading:true});
        try{
            const res = await axiosInstance.get("/messages/chats");
            set({chats:res.data.chatPartners});
        } catch(error){
            toast.error(error.response?.data?.message ||
                "Something went wrong.."
            );
        } finally{
            set({isUserLoading: false})
        }
    },

    getMessagesByUserId : async (userId)=>{
        set({isMessagesLoading:true});
        try{
            const res = await axiosInstance.get(`/messages/${userId}`);
            set({messages: res.data.message});
        } catch(error){
            toast.error(error.response?.data?.message ||
                "Something went wrong.."
            );
        } finally{
            set({isMessagesLoading: false})
        }
    },

    sendMessage : async(messageData)=>{
        const { selectedUser, messages } = get();
        const {authUser} = useAuthStore.getState();

        const tempId = `temp-${Date.now()}`;
        const optimisticTempMessage = {
            _id: tempId,
            sender: authUser._id,
            receiver: selectedUser._id,
            text: messageData.text,
            image: messageData.image,
            createdAt: new Date().toISOString(),
            isOptimistic: true, // Mark this message as optimistic
        };

        set({messages: [...messages, optimisticTempMessage]});
        try{
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`,messageData);
            set({
            messages: get().messages.map(msg =>
                msg._id === tempId ? res.data.message : msg
                )
            });
        } catch(error){
            set({messages: messages.filter(msg => msg._id !== tempId)}); 
            toast.error(error.response?.data?.message ||
                "Something went wrong.."
            );
            
        }
    },

    subscribeToNewMessages: ()=>{
        const { selectedUser, isSoundEnabled } = get();
        if(! selectedUser) return;
        const {socket} = useAuthStore.getState();
        if(socket){
            socket.on("newMessage", (newMessage)=>{
                const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
                if(!isMessageSentFromSelectedUser) return;
                const {messages} = get();
                set({messages: [...messages, newMessage]});

                if(isSoundEnabled){
                    const notificationSound = new Audio("/sounds/notification.mp3");

                    notificationSound.currentTime = 0;
                    notificationSound.play().catch((error)=>{
                        console.error("Error playing notification sound: ", error);
                    });
                }
            });
        }
    },

    unsubscribeFromNewMessages: ()=>{
        const {socket} = useAuthStore.getState();
        if(socket){
            socket.off("newMessage");
        }
    }
}))
import React from 'react'
import { XIcon } from "lucide-react";
import { useChatStore } from '../store/useChatStore';
import { useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';

function ChatHeader() {
    const { selectedUser,setSelectedUser } = useChatStore();
    const {OnlineUsers} = useAuthStore();

    useEffect(() => {
        const handleEscapeKey = (event) => {
            if (event.key === 'Escape') {
                setSelectedUser(null);
            }
        }

        window.addEventListener('keydown', handleEscapeKey);

        return()=>{
            window.removeEventListener('keydown', handleEscapeKey);
        }
    }, [setSelectedUser]);

  return (
    <div
      className="flex justify-between items-center bg-slate-800/50 border-b
   border-slate-700/50 max-h-[84px] px-6 flex-1"
    >
      <div className="flex items-center space-x-3">
        <div className={`avatar avatar-${OnlineUsers.includes(selectedUser._id) ? "online" : "offline"}`}>
          <div className="w-12 rounded-full">
            <img src={selectedUser.profilePic || "/avatar.png"} alt={selectedUser.name} />
          </div>
        </div>

        <div>
          <h3 className="text-slate-200 font-medium">{selectedUser.name}</h3>
          <p className="text-slate-400 text-sm">{OnlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}</p>
        </div>
      </div>

      <button onClick={() => setSelectedUser(null)}>
        <XIcon className="w-5 h-5 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer" />
      </button>
    </div>
  );
}
export default ChatHeader;
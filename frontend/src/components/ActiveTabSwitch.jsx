import React from 'react'
import { useChatStore } from "../store/useChatStore"

function ActiveTabSwitch() {
  const {activeTab, setActiveTab} = useChatStore()
  return (
    <div className='flex justify-center items-center'>
      <div className="tabs tabs-boxed bg-transparent p-2 m-2">
        <button
          onClick={() => setActiveTab("chats")}
          className={`tab w-[100px] rounded-lg mr-2 ${
            activeTab === "chats" ? "bg-cyan-500/20 text-cyan-400" : "text-slate-400"
          }`}
        >
          Chats
        </button>

        <button
          onClick={() => setActiveTab("contacts")}
          className={`tab w-[100px] rounded-lg ml-2 ${
            activeTab === "contacts" ? "bg-cyan-500/20 text-cyan-400" : "text-slate-400"
          }`}
        >
          Contacts
        </button>
      </div>
    </div>
    
  );
}
export default ActiveTabSwitch

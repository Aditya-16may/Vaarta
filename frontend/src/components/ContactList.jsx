import React from 'react'
import UsersLoadingSkeleton from './UsersLoadingSkeleton';
import NoChatsFound from './NoChatsFound';
import { useEffect } from 'react';
import { useChatStore } from '../store/useChatStore';
import { useAuthStore } from '../store/useAuthStore';

function ContactList() {
  const {allContacts, setAllContacts, isUserLoading, setSelectedUser} = useChatStore();
  const {OnlineUsers} = useAuthStore();
  useEffect(()=>{
    setAllContacts();
  },[setAllContacts]);

  if(isUserLoading){
    return <UsersLoadingSkeleton />
  }

  if(allContacts.length === 0){
    return <NoChatsFound />
  }

  return (
    <>
      {allContacts.map((contact) => (
        <div
          key={contact._id}
          className="bg-cyan-500/10 p-4 rounded-lg cursor-pointer hover:bg-cyan-500/20 transition-colors"
          onClick={() => setSelectedUser(contact)}
        >
          <div className="flex items-center gap-3">
            <div className={`avatar avatar-${OnlineUsers.includes(contact._id) ? "online" : "offline"}`}>
              <div className="size-12 rounded-full overflow-hidden">
                <img src={contact.profilePic || "/avatar.png"} alt={contact.name} className="size-full object-cover" />
              </div>
            </div>
            <h4 className="text-slate-200 font-medium truncate">{contact.name}</h4>
          </div>
        </div>
      ))}
    </>
  )
}

export default ContactList

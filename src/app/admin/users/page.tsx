"use client";

import { useState } from "react";
import { useAdminUsers } from "@/hooks/useAdminHooks";
import { 
  Loader2, 
  Search, 
  Filter, 
  MoreVertical, 
  Users,
  ShieldCheck,
  User as UserIcon,
  X,
  Mail,
  CalendarDays,
  Phone,
  Briefcase
} from "lucide-react";

export default function AdminUsersPage() {
  const { users, isLoading, isError } = useAdminUsers();
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("All"); 
  const [selectedUser, setSelectedUser] = useState<any | null>(null);

  const getInitials = (name: string, email: string) => {
    if (!name || name === "User") return email ? email.charAt(0).toUpperCase() : "U";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return parts[0][0].toUpperCase();
  };

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const filteredUsers = users?.filter((u: any) => {
    const searchLower = searchTerm.toLowerCase();
    const name = u.name?.toLowerCase() || "";
    const email = u.email?.toLowerCase() || "";
    const matchesSearch = name.includes(searchLower) || email.includes(searchLower);

    const role = u.user_role?.role?.toLowerCase() || "member";
    const memberType = u.user_role?.member_type?.toLowerCase() || "regular";
    
    let matchesRole = true;
    if (roleFilter === "Official") {
      matchesRole = role === "admin" && memberType === "official";
    } else if (roleFilter === "Regular") {
      matchesRole = role === "member" && memberType === "regular";
    }
    
    return matchesSearch && matchesRole;
  });

  const renderRoleBadge = (userRole: any) => {
    const role = userRole?.role?.toLowerCase() || "member";
    const memberType = userRole?.member_type?.toLowerCase() || "regular";

    if (role === "admin" && memberType === "official") {
      return (
        <span className="flex items-center gap-1.5 w-max px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-[10px] font-bold uppercase tracking-widest border border-purple-100">
          <ShieldCheck className="w-3 h-3" /> Official Admin
        </span>
      );
    }
    
    return (
      <span className="flex items-center gap-1.5 w-max px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-[10px] font-bold uppercase tracking-widest border border-gray-200">
        <UserIcon className="w-3 h-3" /> Regular Member
      </span>
    );
  };

  return (
    <div className="w-full h-full p-8 font-sans relative">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Users Management</h1>
          <p className="text-gray-500 font-medium mt-1">Manage and view all registered NextFly users.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search names, emails..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-[#d9232d] transition-all shadow-sm"
            />
          </div>
          <button className="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors shadow-sm">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-6">
        {["All", "Regular", "Official"].map((tab) => (
          <button
            key={tab}
            onClick={() => setRoleFilter(tab)}
            className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${
              roleFilter === tab 
                ? "bg-gray-900 text-white shadow-md" 
                : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            {tab === "All" ? "All Users" : `${tab} Users`}
          </button>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-[2rem] shadow-sm overflow-hidden">
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">User</th>
                <th className="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Contact Info</th>
                <th className="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Account Type</th>
                <th className="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Joined Date</th>
                <th className="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap text-right">Actions</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-[#d9232d] mx-auto mb-3" />
                    <p className="text-sm font-bold text-gray-500">Loading user database...</p>
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <p className="text-sm font-bold text-red-500">Failed to load users. Please try again.</p>
                  </td>
                </tr>
              ) : filteredUsers?.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="w-8 h-8 text-gray-300" />
                    </div>
                    <p className="text-base font-bold text-gray-900 mb-1">No {roleFilter !== "All" ? roleFilter.toLowerCase() : ""} users found</p>
                    <p className="text-sm font-medium text-gray-500">Try adjusting your search criteria or filters.</p>
                  </td>
                </tr>
              ) : (
                filteredUsers?.map((user: any) => (
                  <tr key={user.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-red-50 text-[#d9232d] flex items-center justify-center font-black text-sm border border-red-100 shrink-0">
                          {getInitials(user.name, user.email)}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-gray-900 capitalize">{user.name || "Unknown User"}</span>
                          <span className="text-xs font-medium text-gray-400 mt-0.5">ID: {user.id?.toString().slice(0, 8)}...</span>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail className="w-3.5 h-3.5 text-gray-400" />
                          <span className="font-medium">{user.email}</span>
                        </div>
                        {user.phone && (
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Phone className="w-3.5 h-3.5 text-gray-400" />
                            <span>{user.phone}</span>
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-5 whitespace-nowrap">
                      {renderRoleBadge(user.user_role)}
                    </td>

                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-600">
                        {formatDate(user.created_at)}
                      </span>
                    </td>

                    <td className="px-6 py-5 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => setSelectedUser(user)}
                          className="px-3 py-1.5 bg-white border border-gray-200 text-xs font-bold text-gray-700 rounded-lg hover:bg-gray-50 hover:text-[#d9232d] transition-colors"
                        >
                          View Details
                        </button>
                        <button className="p-1.5 text-gray-400 hover:text-gray-900 bg-white border border-transparent hover:border-gray-200 rounded-lg transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity"
            onClick={() => setSelectedUser(null)}
          ></div>
          
          <div className="relative w-full max-w-md bg-white rounded-[2rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-xl font-black text-gray-900 tracking-tight">User Profile</h2>
              <button 
                onClick={() => setSelectedUser(null)}
                className="w-8 h-8 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-all shadow-sm"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-8 flex flex-col items-center text-center">
              
              <div className="w-24 h-24 rounded-full bg-red-50 text-[#d9232d] flex items-center justify-center font-black text-3xl border-4 border-white shadow-lg mb-4">
                {getInitials(selectedUser.name, selectedUser.email)}
              </div>
              
              <h3 className="text-2xl font-black text-gray-900 capitalize mb-1">{selectedUser.name || "Unknown"}</h3>
              <p className="text-sm font-medium text-gray-500 mb-6">{selectedUser.email}</p>

              <div className="w-full flex flex-col gap-3 text-left border-t border-gray-100 pt-6">
                
                <div className="flex justify-between items-center bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-3 text-gray-600">
                    <ShieldCheck className="w-5 h-5 text-gray-400" />
                    <span className="text-sm font-bold">Account Role</span>
                  </div>
                  <span className="text-sm font-black capitalize text-gray-900">
                    {selectedUser.user_role?.role || "Member"}
                  </span>
                </div>

                <div className="flex justify-between items-center bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-3 text-gray-600">
                    <Briefcase className="w-5 h-5 text-gray-400" />
                    <span className="text-sm font-bold">Member Type</span>
                  </div>
                  <span className="text-sm font-black capitalize text-gray-900">
                    {selectedUser.user_role?.member_type || "Regular"}
                  </span>
                </div>

                <div className="flex justify-between items-center bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-3 text-gray-600">
                    <CalendarDays className="w-5 h-5 text-gray-400" />
                    <span className="text-sm font-bold">Member Since</span>
                  </div>
                  <span className="text-sm font-black text-gray-900">{formatDate(selectedUser.created_at)}</span>
                </div>

                <div className="flex justify-between items-center bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-3 text-gray-600">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <span className="text-sm font-bold">Phone Number</span>
                  </div>
                  <span className="text-sm font-black text-gray-900">{selectedUser.phone || "Not Provided"}</span>
                </div>

              </div>
              
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
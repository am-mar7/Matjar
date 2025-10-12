import { useLocation } from "react-router-dom";

export default function UserDetails() {
  const { state: user } = useLocation();
    console.log(user);
    
  
  if (!user)
    return (
      <div className="p-8 text-center text-red-500 font-semibold">
        No user data provided.
      </div>
    );



  return (
    <div className="max-w-4xl mx-auto mt-10 flex flex-col gap-6 bg-white rounded-2xl shadow-lg p-8">
      {/* User Info */}
      <div className="flex flex-col gap-1  pb-4">
        <h1 className="text-2xl font-semibold text-slate-800">User Details</h1>
        <p className="text-slate-700">
          <span className="font-medium">Name:</span> {user.name}
        </p>
        <p className="text-slate-700">
          <span className="font-medium">Email:</span> {user.email}
        </p>
        <p className="text-slate-700">
          <span className="font-medium">Joined:</span>{" "}
          {new Date(user.createdAt).toLocaleString()}
        </p>
      </div>
    </div>
  );
}

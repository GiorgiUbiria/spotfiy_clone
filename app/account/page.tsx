import Header from "@/components/Header";

import AccountContent from "./components/AccountContent";
import getSongsByUserId from "@/actions/getSongsByUserId";

const Account = async () => {
  const userSongs = await getSongsByUserId();
  return (
    <div
      className="
        bg-gray-800 
        rounded-lg 
        h-full 
        w-full 
        overflow-hidden 
        overflow-y-auto
      "
    >
      <Header className="bg-gradient-to-b
      from-sky-800">
        <div className="mb-2 flex flex-col gap-y-6">
          <h1 className="text-white text-3xl font-semibold">
            Account Settings
          </h1>
        </div>
      </Header>
      <AccountContent songs={userSongs} />
    </div>
  )
}

export default Account;
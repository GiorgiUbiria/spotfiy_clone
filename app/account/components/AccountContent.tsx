"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useUser } from "@/hooks/useUser";

import { Song } from "@/types";

// import { useSessionContext } from "@supabase/auth-helpers-react";

interface AccountContentProps {
  songs: Song[];
}

const AccountContent: React.FC<AccountContentProps> = ({ songs }) => {
  const router = useRouter();
  const { isLoading, user } = useUser();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/');
    }
  }, [isLoading, user, router]);

  // const { supabaseClient: supabase } = useSessionContext();

  // const handleResetPasswordClick = async () => {
  //   try {
  //     const { data, error } = await supabase.auth.resetPasswordForEmail(user?.email!, {
  //       redirectTo: 'http://localhost/3000/update-password',
  //     })

  //     if (error) {
  //       console.error(error)
  //     } else {
  //       return (data as any);
  //     }
  //     console.log('Password reset link sent successfully.');
  //   } catch (error) {
  //     console.error('Error sending password reset link:', error);
  //   }
  // };

  return (
    <div className="mb-7 px-6">
      <p className="text-lg text-neutral-400 truncate">Email: <em>{user?.email}</em> </p>
      <p className="text-lg text-neutral-400 truncate">Songs added in the library: <em>{songs.length}</em> </p>
      {/* <p onClick={handleResetPasswordClick} className="cursor-pointer text-blue-500 hover:text-blue-500/50">Forgot your password?</p> */}
    </div>
  );
}

export default AccountContent;
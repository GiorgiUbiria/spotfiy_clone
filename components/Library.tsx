'use client';

import { SlPlaylist } from 'react-icons/sl';
import { BsPlusCircleDotted } from 'react-icons/bs';

import useAuthModal from '@/hooks/useAuthModal';
import { useUser } from '@/hooks/useUser';
import useUploadModal from '@/hooks/useUploadModal';
import { Song } from '@/types';
import MediaItem from './MediaItem';
import useOnPlay from '@/hooks/useOnPlay';

interface LibararyProps {
  songs: Song[];
}

const Library: React.FC<LibararyProps> = ({ songs }) => {
  const authModal = useAuthModal();
  const uploadModal = useUploadModal();

  const { user } = useUser();

  const onPlay = useOnPlay(songs);

  const onClick = () => {
    if (!user) {
      return authModal.onOpen();
    }

    // Check for subscription

    return uploadModal.onOpen();
  };

  return (
    <div className='flex flex-col'>
      <div className='flex items-center justify-between px-5 pt-4'>
        <div className='inline-flex items-center gap-x-2'>
          <SlPlaylist size={26} className='text-neutral-400' />
          <p className='text-neutral-400 font-medium text-md'> Your Library </p>
        </div>
        <BsPlusCircleDotted
          onClick={onClick}
          size={20}
          className='text-neutral-400 cursor-pointer hover:text-white hover:rotate-90 transition'
        />
      </div>
      <div className='flex flex-col gap-y-2 mt-4 px-3'>
        {
          songs.map((item) => (
            <MediaItem
              key={item.id}
              onClick={(id: string) => onPlay(id)}
              data={item}
            />
          ))
        }
      </div>
    </div>
  )
}

export default Library
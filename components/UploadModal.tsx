'use client';

import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

import useUploadModal from "@/hooks/useUploadModal";
import Input from "./Input";

import Modal from "./Modal";
import Button from "./Button";
import toast from "react-hot-toast";
import { useUser } from "@/hooks/useUser";
import uniqid from "uniqid";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";
import TextArea from "./TextArea";

const UploadModal = () => {
  const [isLoading, setIsLoading] = useState(false);
  const uploadModal = useUploadModal();
  const { user } = useUser();
  const supabaseClient = useSupabaseClient();
  const router = useRouter();

  const { register, handleSubmit, reset } = useForm<FieldValues>({
    defaultValues: {
      author: '',
      title: '',
      lyrics: '',
      lyrics_txt: null,
      song: null,
      image: null,
    }
  })

  const onChange = (open: boolean) => {
    if (!open) {
      reset();
      uploadModal.onClose();
    }
  }

  const onSubmit: SubmitHandler<FieldValues> = async (values) => {
    try {
      setIsLoading(true);

      const imageFile = values.image?.[0];
      const songFile = values.song?.[0];
      const lyricsFile = values.lyrics_txt?.[0];


      if (!imageFile || !songFile || !user) {
        toast.error('Missing Fields');
        return;
      }

      let lyrics = values.lyrics;

      if (lyricsFile) {
        const reader = new FileReader();
        const text = await new Promise((resolve, reject) => {
          reader.onload = (e) => resolve(e?.target?.result);
          reader.onerror = (e) => reject(e);
          reader.readAsText(lyricsFile);
        });

        lyrics = text as string;
      }

      const uniqueID = uniqid();

      const { data: songData, error: songError } = await supabaseClient.storage.from('songs').upload(`song-${values.title}-${uniqueID}`, songFile, {
        cacheControl: '3600',
        upsert: false
      });

      if (songError) {
        setIsLoading(false);
        return toast.error('Failed song upload');
      }

      const { data: imageData, error: imageError } = await supabaseClient.storage.from('images').upload(`image-${values.title}-${uniqueID}`, imageFile, {
        cacheControl: '3600',
        upsert: false
      });

      if (imageError) {
        setIsLoading(false);
        return toast.error('Failed image upload');
      }

      const { error: supabaseError } = await supabaseClient
        .from('songs')
        .insert({
          user_id: user.id,
          title: values.title,
          author: values.author,
          lyrics: lyrics,
          image_path: imageData.path,
          song_path: songData.path
        })

      if (supabaseError) {
        setIsLoading(false);
        return toast.error('Failed image upload');
      }

      router.refresh();
      setIsLoading(false);
      toast.success('Song created');
      reset();
      uploadModal.onClose();
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Modal
      title="Add a song"
      description="Upload a mp3 file"
      isOpen={uploadModal.isOpen}
      onChange={onChange}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="
          flex 
          flex-col
          gap-y-4
        "
      >
        <Input
          id='title'
          disabled={isLoading}
          {...register('title', { required: true })}
          placeholder="Song Title"
        />
        <Input
          id='author'
          disabled={isLoading}
          {...register('author', { required: true })}
          placeholder="Song Author"
        />
        <div className="pb-1 pt-1 border-y-2 border-spacing-4 border-dashed border-neutral-400">
          <TextArea
            id='lyrics'
            disabled={isLoading}
            {...register('lyrics', { required: false })}
            placeholder="Song Lyrics"
          />
          <p className="text-sm py-2 text-neutral-400">Or upload a <em>.txt</em> file:</p>
          <Input
            id='lyrics_txt'
            type='file'
            disabled={isLoading}
            accept=".txt"
            {...register('lyrics_txt', { required: false })}
          />
        </div>
        <div>
          <div className="pb-1">
            Select a song file:
          </div>
          <Input
            id='song'
            type='file'
            disabled={isLoading}
            accept=".mp3"
            {...register('song', { required: true })}
          />
        </div>
        <div>
          <div className="pb-1">
            Select an image:
          </div>
          <Input
            id='image'
            type='file'
            disabled={isLoading}
            accept="image/*"
            {...register('image', { required: true })}
          />
        </div>
        <Button disabled={isLoading} type="submit">
          {isLoading ? 'Please wait...' : 'Create'}
        </Button>
      </form>
    </Modal>
  )
}

export default UploadModal
import {type ClassValue, clsx} from "clsx"
import {twMerge} from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function uploadToImgbb(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('image', new File([file], `${crypto.randomUUID()}.${file.name.split('.').pop()}`));

  const res = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`, {
    method: 'POST',
    body: formData,
  });

  const data = await res.json();
  return data.data.url;
}

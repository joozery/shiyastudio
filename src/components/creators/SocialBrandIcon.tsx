import Image from 'next/image';
import {Users} from 'lucide-react';
const icons:Record<string,string>={Instagram:'instagram',TikTok:'tiktok',Facebook:'facebook',YouTube:'youtube'};
export function SocialBrandIcon({platform,size=18}:{platform:string;size?:number}){
 const icon=icons[platform];
 return icon?<Image src={`/icons/social/${icon}.svg`} alt="" width={size} height={size}/>:<Users size={size} aria-hidden="true"/>;
}

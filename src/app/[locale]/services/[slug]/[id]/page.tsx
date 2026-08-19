"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { Play, ArrowLeft, ChevronRight, LayoutGrid, List, Image as ImageIcon, Camera, Music } from "lucide-react";
import Image from "next/image";
import { Link } from '@/navigation';

export default function DynamicServiceDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const slug = params.slug as string;
  const [galleryFilter, setGalleryFilter] = useState("ALL");
  const [activeTab, setActiveTab] = useState("CONTENT");
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);

  React.useEffect(() => {
    fetch('/api/service-works')
      .then(res => res.json())
      .then(data => {
        const works = data?.services?.[slug] || [];
        const project = works.find((p: any) => p.id === id);
        setSelectedProject(project || null);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-white text-black font-sans">
        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
      </main>
    );
  }

  if (!selectedProject) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-white text-black font-sans">
        <h1 className="text-2xl font-bold mb-4">Project not found</h1>
        <Link href={`/services/${slug}`} className="px-6 py-2 bg-black text-white rounded-md text-sm font-bold tracking-widest uppercase">
          BACK TO WORKS
        </Link>
      </main>
    );
  }

  const galleryItems = selectedProject.gallery?.filter((item: any) => 
    galleryFilter === "ALL" ? true : item.type === galleryFilter
  ) || [];

  return (
    <main className="min-h-screen font-sans selection:bg-[#0EA5E9] selection:text-black bg-white text-black">
      
      <div className="animate-in fade-in slide-in-from-bottom-8 duration-500 w-full min-h-screen bg-white">
        
        {/* Custom Dark Navbar for Detail View */}
        <div className="absolute top-0 left-0 w-full z-50 px-6 py-6 md:px-12 flex justify-between items-center pointer-events-none">
           <div className="pointer-events-auto">
              <Link 
                href={`/services/${slug}`}
                className="flex items-center gap-2 text-[#0EA5E9] font-bold text-[10px] tracking-widest uppercase hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Back to all works
              </Link>
           </div>
        </div>

        {/* HERO SECTION (Dark) */}
        <div className="relative w-full bg-[#050505] text-white pt-24 pb-20 px-6 md:px-12 xl:px-24 min-h-[60vh] flex flex-col justify-center overflow-hidden">
          {/* Background Image on right side */}
          <div className="absolute top-0 right-0 w-full md:w-2/3 h-full z-0">
            {(selectedProject.heroImage || selectedProject.coverImage) && (
              <Image src={selectedProject.heroImage || selectedProject.coverImage} fill className="object-cover object-center opacity-60 mix-blend-screen" alt="" />
            )}
            {/* Gradient mask */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/80 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
          </div>

          {/* Hero Content */}
          <div className="relative z-10 max-w-7xl mx-auto w-full flex flex-col pt-10">
             <div className="max-w-xl">
               {selectedProject.logoText && (
                 <div className="bg-red-600 text-white font-black italic px-4 py-2 text-xl md:text-2xl w-fit mb-6 tracking-tighter rounded-sm inline-block shadow-lg">
                   {selectedProject.logoText}
                 </div>
               )}
               <h1 className="text-4xl md:text-6xl font-bold mb-2 tracking-tight">{selectedProject.brand}</h1>
               <p className="text-white/80 text-xl md:text-2xl mb-8 font-light">{selectedProject.campaign}</p>
               {selectedProject.tags && selectedProject.tags.length > 0 && (
               <div className="flex flex-wrap gap-3 mb-8">
                   {selectedProject.tags.map((tag: string) => (
                     <span key={tag} className="border border-[#0EA5E9] text-[#0EA5E9] text-[9px] md:text-[10px] font-bold px-4 py-1.5 rounded-full tracking-widest uppercase">
                       {tag}
                     </span>
                   ))}
               </div>
               )}
               {selectedProject.about && (
               <p className="text-white/60 text-sm leading-relaxed max-w-md">
                   {selectedProject.about}
                </p>
               )}
             </div>
          </div>

          {/* Stats - Bottom Right */}
          {selectedProject.stats && (
          <div className="absolute bottom-10 right-6 md:right-12 xl:right-24 z-10 flex gap-6 md:gap-12">
             <div className="text-center">
                <div className="text-3xl md:text-5xl font-bold mb-1 tracking-tighter">{selectedProject.stats.reach}</div>
                <div className="text-white/60 text-[10px] md:text-xs font-bold tracking-widest uppercase">Total Reach</div>
             </div>
             <div className="w-px bg-white/20 my-2" />
             <div className="text-center">
                <div className="text-3xl md:text-5xl font-bold mb-1 tracking-tighter">{selectedProject.stats.views}</div>
                <div className="text-white/60 text-[10px] md:text-xs font-bold tracking-widest uppercase">Total Views</div>
             </div>
             <div className="w-px bg-white/20 my-2" />
             <div className="text-center">
                <div className="text-3xl md:text-5xl font-bold mb-1 tracking-tighter">{selectedProject.stats.engagement}</div>
                <div className="text-white/60 text-[10px] md:text-xs font-bold tracking-widest uppercase">Engagement Rate</div>
             </div>
          </div>
          )}
        </div>

        <div className="w-full border-b border-gray-200 bg-white sticky top-0 z-40 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 flex justify-center gap-6 md:gap-16 overflow-x-auto scrollbar-hide">
            {["OVERVIEW", "GALLERY", "CONTENT"].map(tab => (
               <button 
                 key={tab} 
                 onClick={() => setActiveTab(tab)}
                 className={`py-5 text-[10px] md:text-xs font-bold tracking-widest transition-colors border-b-2 whitespace-nowrap ${activeTab === tab ? "border-[#0EA5E9] text-[#0EA5E9]" : "border-transparent text-gray-500 hover:text-black"}`}
               >
                 {tab}
               </button>
            ))}
          </div>
        </div>

        {/* CONTENT AREA */}
        <div className="bg-white text-black pt-16 pb-24 px-6 md:px-12 xl:px-24">
          <div className="max-w-7xl mx-auto">
             
             {activeTab === "CONTENT" && (
               <>
                 {/* Content Header */}
                 <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-12">
                <div>
                  <div className="flex items-center gap-2 text-[#0EA5E9] font-bold text-[10px] tracking-widest mb-3 uppercase">
                    <span>&gt;</span><span>CONTENT</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-3 text-black tracking-tight">Project Content</h2>
                  <p className="text-gray-500 text-sm max-w-xl">
                    A collection of photo and video content created for this campaign.
                  </p>
                </div>
                
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                   {/* Filter Tabs */}
                   <div className="flex gap-2">
                      {["ALL", "VIDEO", "PHOTO"].map(f => (
                         <button 
                           key={f} 
                           onClick={() => setGalleryFilter(f)} 
                           className={`px-5 py-2 rounded-md text-[10px] font-bold tracking-widest border transition-all ${galleryFilter === f ? "bg-black text-white border-black" : "bg-white text-gray-500 border-gray-200 hover:border-gray-400"}`}
                         >
                           {f}
                         </button>
                      ))}
                   </div>
                   <div className="hidden md:block w-px h-8 bg-gray-200 mx-2" />
                   {/* View Toggles */}
                   <div className="flex gap-2">
                      <button className="p-2 rounded bg-orange-50 text-[#0EA5E9] border border-[#0EA5E9]/20"><LayoutGrid className="w-4 h-4"/></button>
                      <button className="p-2 rounded bg-white text-gray-400 border border-gray-200 hover:bg-gray-50"><List className="w-4 h-4"/></button>
                   </div>
                </div>
             </div>

              {/* Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                 {galleryItems.map((item: any, idx: number) => {
                    const isVidUrl = (u: string) => !!u && /\.(mp4|mov|webm|m4v)(\?|$)/i.test(u);
                    // A video file may have been uploaded into the image field by mistake -
                    // treat it as the video source so it still plays instead of showing broken.
                    const videoSrc = item.videoUrl || (isVidUrl(item.image) ? item.image : '');
                    // Thumbnail is the image only when it's a real image (not a video file).
                    let thumbnailSrc = (item.image && !isVidUrl(item.image)) ? item.image : '';
                    if (!thumbnailSrc && videoSrc) {
                      const ytMatch = videoSrc.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]+)/);
                      if (ytMatch) thumbnailSrc = `https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg`;
                    }
                    const hasThumbnail = !!thumbnailSrc;
                    const isVideoItem = item.type === 'VIDEO' || !!videoSrc;

                    return (
                    <div key={idx}
                       onClick={() => { if (!videoSrc) return; if (isVidUrl(videoSrc)) setPlayingVideo(videoSrc); else window.open(videoSrc, '_blank'); }}
                       className={`flex flex-col gap-3 group animate-in fade-in slide-in-from-bottom-4 ${videoSrc ? 'cursor-pointer' : 'cursor-default'}`}
                       style={{ animationDelay: `${idx * 50}ms` }}>
                       {/* Image Box */}
                       <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-gray-100 border border-gray-100">
                          {hasThumbnail ? (
                            <img src={thumbnailSrc} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="" />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 text-gray-400">
                              {item.type === 'VIDEO' ? (
                                <>
                                  <Play className="w-10 h-10 mb-2 opacity-40" />
                                  <span className="text-[10px] font-bold tracking-widest uppercase opacity-60">Video</span>
                                </>
                              ) : (
                                <>
                                  <ImageIcon className="w-10 h-10 mb-2 opacity-40" />
                                  <span className="text-[10px] font-bold tracking-widest uppercase opacity-60">Photo</span>
                                </>
                              )}
                            </div>
                          )}
                          
                          {isVideoItem && (
                            <>
                               <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors" />
                               <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                                     <Play className="w-4 h-4 text-black ml-1 fill-black" />
                                  </div>
                               </div>
                               {item.duration && (
                                 <div className="absolute bottom-3 right-3 bg-black/80 text-white text-[10px] px-2 py-1 rounded font-mono font-medium">
                                    {item.duration}
                                 </div>
                               )}
                            </>
                          )}

                          {!isVideoItem && (
                            <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-sm p-1.5 rounded text-white shadow-sm">
                               <ImageIcon className="w-3 h-3" />
                            </div>
                          )}

                          {/* Source Badge */}
                          {videoSrc && (
                            <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white text-[9px] font-bold px-2 py-1 rounded tracking-widest">
                              {videoSrc.includes('tiktok') ? 'TIKTOK' : videoSrc.includes('youtu') ? 'YOUTUBE' : videoSrc.includes('instagram') ? 'IG' : isVidUrl(videoSrc) ? 'VIDEO' : 'LINK'}
                            </div>
                          )}
                       </div>
                       
                       {/* Influencer Info */}
                       <div className="flex items-center gap-3 px-1">
                          <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden relative flex-shrink-0 border border-gray-100 flex items-center justify-center">
                             {hasThumbnail ? (
                               <img src={thumbnailSrc} className="w-full h-full object-cover" alt="" />
                             ) : (
                               <Camera className="w-4 h-4 text-gray-400" />
                             )}
                             <div className="absolute bottom-0 right-0 w-3 h-3 bg-white rounded-full flex items-center justify-center shadow-sm">
                                {item.influencer?.platform === "Instagram" 
                                  ? <Camera className="w-2 h-2 text-pink-600" /> 
                                  : <Music className="w-2 h-2 text-black" />
                                }
                             </div>
                          </div>
                          <div className="flex flex-col leading-tight">
                             <span className="text-[13px] font-bold text-black">{item.influencer?.username || "Unknown"}</span>
                             <span className="text-[10px] text-gray-500">{item.influencer?.platform || "Social Media"}</span>
                          </div>
                       </div>
                    </div>
                    );
                 })}
              </div>

             {galleryItems.length === 0 && (
               <div className="text-gray-400 text-sm py-20 text-center border-2 border-dashed border-gray-100 rounded-xl">
                 No content found for this category.
               </div>
             )}

             {/* Load More */}
             {galleryItems.length > 0 && (
               <div className="flex justify-center mt-16">
                  <button className="flex items-center gap-2 px-8 py-3 rounded-sm border border-gray-300 text-gray-600 text-[10px] font-bold tracking-widest hover:bg-gray-50 transition-colors">
                    LOAD MORE CONTENT
                    <ChevronRight className="w-3 h-3 rotate-90" />
                  </button>
               </div>
             )}
               </>
             )}

             {activeTab === "OVERVIEW" && (
               <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex flex-col md:flex-row gap-12 lg:gap-24 mb-20">
                     <div className="md:w-1/3">
                        <div className="flex items-center gap-2 text-[#0EA5E9] font-bold text-[10px] tracking-widest mb-3 uppercase">
                          <span>&gt;</span><span>PROJECT BACKGROUND</span>
                        </div>
                        <h2 className="text-3xl font-bold mb-6 tracking-tight">About This Project</h2>
                        <p className="text-gray-500 text-sm leading-relaxed">
                          {selectedProject.about || "No description added yet."}
                        </p>
                     </div>
                     <div className="md:w-2/3 grid grid-cols-2 gap-4">
                        {(() => {
                          const overviewImages = [
                            selectedProject.gallery?.[0]?.image,
                            selectedProject.gallery?.[1]?.image || selectedProject.heroImage || selectedProject.coverImage,
                          ].filter(Boolean);
                          if (overviewImages.length === 0) {
                            return (
                              <div className="col-span-2 aspect-[3/2] rounded-xl bg-gray-100 flex items-center justify-center text-gray-300">
                                <ImageIcon className="w-10 h-10" />
                              </div>
                            );
                          }
                          return overviewImages.slice(0, 2).map((src, i) => (
                            <div key={i} className={`relative aspect-[3/4] rounded-xl overflow-hidden bg-gray-100 ${i === 1 ? 'translate-y-8' : ''}`}>
                              <Image src={src} fill className="object-cover" alt="" />
                            </div>
                          ));
                        })()}
                     </div>
                  </div>
               </div>
             )}

             {activeTab === "GALLERY" && (
               <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center gap-2 text-[#0EA5E9] font-bold text-[10px] tracking-widest mb-3 uppercase">
                    <span>&gt;</span><span>CAMPAIGN GALLERY</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-10 tracking-tight">Behind the Scenes & Highlights</h2>

                  {(selectedProject.gallery || []).filter((g: any) => g.image).length > 0 ? (
                    <div className="columns-1 sm:columns-2 md:columns-3 gap-6 space-y-6">
                       {selectedProject.gallery.filter((g: any) => g.image).map((item: any, i: number) => (
                         <div key={item.id ?? i} className="relative w-full rounded-xl overflow-hidden break-inside-avoid bg-gray-100 group">
                            <Image
                              src={item.image}
                              width={600}
                              height={600}
                              className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                              alt=""
                            />
                         </div>
                       ))}
                    </div>
                  ) : (
                    <div className="text-gray-400 text-sm py-20 text-center border-2 border-dashed border-gray-100 rounded-xl">
                      No gallery images yet.
                    </div>
                  )}
               </div>
             )}
             
          </div>
        </div>
        
      </div>

      {playingVideo && (
        <div className="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center p-4" onClick={() => setPlayingVideo(null)}>
          <button onClick={() => setPlayingVideo(null)} className="absolute top-6 right-6 text-white/70 hover:text-white text-xs font-bold tracking-widest uppercase">Close ✕</button>
          <video src={playingVideo} controls autoPlay className="max-w-full max-h-[85vh] rounded-lg shadow-2xl" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </main>
  );
}

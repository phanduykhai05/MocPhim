import React from 'react';
import Background from '@/app/(default)/phim/[slug]/components/Backgroud';
import Sidebar from '@/app/(default)/phim/[slug]/components/Siderbar';
import Hero from '@/app/(default)/phim/[slug]/components/Hero';
const MovieDetailTemplatePage = () => {
    return (
        <div className='bg-[#191b24]'>
            <Background />
            {/* class pah nnay theo style nayf  */}
            <div className='relative z-9 pt-0 pb-10'>
                <div className='w-full max-w-[1640px] px-5 mx-auto mt-[-580px] md:mt-[-200px] relative z-3 flex flex-col md:flex-row gap-4 md:gap-8 justify-between items-start md:items-stretch bottom-0 md:bottom-[30rem]'>
                    <div className='w-full md:w-auto static md:relative md:self-start'>
                        <Sidebar />
                    </div>
                    <div className='w-full relative z-3 mt-0 md:mt-[-200px] bottom-0 md:bottom-[-40rem]'>
                        <Hero />
                    </div>
                </div>

            </div>
        </div>
    );
};

export default MovieDetailTemplatePage;

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
                <div className='w-full max-w-[1640px] px-5 mx-auto mt-[-580px] md:mt-[-450px] relative z-3 flex flex-col lg:flex-row gap-4 lg:gap-8 justify-between items-start lg:items-stretch'>
                    <div className='w-full lg:w-auto'>
                        <Sidebar />
                    </div>
                    <div className='w-full relative z-3'>
                        <Hero />
                    </div>
                </div>

            </div>
        </div>
    );
};

export default MovieDetailTemplatePage;

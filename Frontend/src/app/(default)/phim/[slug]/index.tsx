import React from 'react';
import Background from '@/app/(default)/phim/[slug]/components/Backgroud';
import Sidebar from '@/app/(default)/phim/[slug]/components/Siderbar';
const MovieDetailTemplatePage = () => {
    return (
        <div className='bg-[#191b24]'>
            <Background />
            {/* class pah nnay theo style nayf  */}
            <div className='relative z-9 pt-0 pb-10'>
                <div className='w-full max-w-[1640px] px-5 mx-auto mt-[-200px] relative z-3 flex justify-between items-stretch md:bottom-[30rem] bottom-[25rem]'>
                    <Sidebar />
                </div>

            </div>
        </div>
    );
};

export default MovieDetailTemplatePage;

import MagnifierIcon from "@/components/icon/magnifier-icon";

const SearchBar = () => {
  return (
    <div className="relative w-full max-w-[23rem] hidden md:block">
      {/* Search Icon */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70">
        <MagnifierIcon size={22} color="white" strokeWidth={1.5} />
      </div>
      
      {/* Input Field */}
      <input 
        type="text" 
        id="main-search" 
        placeholder="Tìm kiếm phim, diễn viên" 
        autoComplete="off"
        className="w-full h-[2.8rem] pl-[3rem] pr-4 bg-white/10 text-white text-sm outline-none rounded-md border border-transparent focus:bg-white/20 transition-all placeholder:text-gray-300"
      />
    </div>
  );
};

export default SearchBar;
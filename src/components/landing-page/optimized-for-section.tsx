import Image from "next/image";

const OptimizedForSection = () => {
  return (
    <section className="text-center lg:px-36 px-10 my-10">
      <div className="text-gray4">Optimized For</div>
      <div className="flex justify-center mt-6 flex-wrap gap-y-3 gap-6">
        <Image src="/distributors/dist-shorts.svg" alt="shorts" width={73} height={73}/>
        <Image src="/distributors/dist-tiktok.svg" alt="dist-tiktok" width={90} height={20}/>
        <Image src="/distributors/dist-instagram.svg" alt="dist-instagram" width={93} height={32}/>
        <Image src="/distributors/dist-youtube.svg" alt="dist-youtube" width={80} height={20}/>
      </div>
    </section>
  );
};

export default OptimizedForSection;

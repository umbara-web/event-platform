import Image from 'next/image';
import { Marquee } from '@/src/components/ui/marquee';
import { trustedCompaniesData } from './data/trusted-companies-data';

export function TrustedBy() {
  return (
    <div className='mt-6.5 md:mt-16 dark:bg-black'>
      <h3 className='text-center text-3xl font-extrabold tracking-tight md:text-4xl dark:bg-black'>
        Dipercaya oleh Perusahaan Terkemuka
      </h3>

      <CompaniesMarquee />
    </div>
  );
}

const CompaniesMarquee = () => {
  return (
    <div className='relative container mx-auto flex h-28.5 items-center px-4 md:h-50 md:px-6 lg:px-8 dark:bg-black'>
      <div className='w-full overflow-hidden mix-blend-luminosity'>
        <Marquee className='py-4'>
          {trustedCompaniesData.map((data) => (
            <Image
              key={data.alt}
              src={data.src}
              alt={data.alt}
              className='h-full w-auto object-contain transition-all duration-300 select-none'
              style={{
                height: 'clamp(2.13rem, 3.97vw, 3rem)',
              }}
            />
          ))}
        </Marquee>

        <div className='pointer-events-none absolute inset-y-0 left-0 w-[15%] bg-linear-to-r from-white to-transparent dark:from-black' />
        <div className='pointer-events-none absolute inset-y-0 right-0 w-[15%] bg-linear-to-l from-white to-transparent dark:from-black' />
      </div>
    </div>
  );
};

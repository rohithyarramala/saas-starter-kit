import app from '@/lib/app';
import Image from 'next/image';
import useTheme from 'hooks/useTheme';

const Brand = () => {
  const { theme } = useTheme();
  return (
    <div className="flex pt-6 shrink-0 items-center text-xl font-bold gap-2 dark:text-gray-100  justify-center">
      <Image
        src={theme !== 'dark' ? app.logoUrl : '/logo.png'}
        alt={app.name}
        width={140}
        height={40}
      />
      {/* {app.name} */}
    </div>
  );
};

export default Brand;

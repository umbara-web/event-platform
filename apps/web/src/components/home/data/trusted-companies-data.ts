import { StaticImageData } from 'next/image';

import AdobeIcon from '@/public/icons/icon-adobe.svg';
import AirbnbIcon from '@/public/icons/icon-airbnb.svg';
import DatabricksIcon from '@/public/icons/icon-databricks.svg';
import DropboxIcon from '@/public/icons/icon-dropbox.svg';
import NetflixIcon from '@/public/icons/icon-netflix.svg';
import PaypalIcon from '@/public/icons/icon-paypal.svg';
import PostmanIcon from '@/public/icons/icon-postman.svg';
import UpworkIcon from '@/public/icons/icon-upwork.svg';
import ZoomIcon from '@/public/icons/icon-zoom.svg';

type TrustedCompanyImageProps = {
  src: StaticImageData;
  alt: string;
};

export const trustedCompaniesData: TrustedCompanyImageProps[] = [
  {
    src: AdobeIcon,
    alt: 'Adobe',
  },
  {
    src: AirbnbIcon,
    alt: 'Airbnb',
  },
  {
    src: DatabricksIcon,
    alt: 'Databricks',
  },
  {
    src: DropboxIcon,
    alt: 'Dropbox',
  },
  {
    src: NetflixIcon,
    alt: 'Netflix',
  },
  {
    src: PaypalIcon,
    alt: 'Paypal',
  },
  {
    src: PostmanIcon,
    alt: 'Postman',
  },
  {
    src: UpworkIcon,
    alt: 'Upwork',
  },
  {
    src: ZoomIcon,
    alt: 'Zoom',
  },
];

import { Loading } from '@/components/shared';
import useOrganizations from 'hooks/useOrganizations';
import { GetServerSidePropsContext } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import type { NextPageWithLayout } from 'types';

const Dashboard: NextPageWithLayout = () => {
  const router = useRouter();
  const { organizations, isLoading } = useOrganizations();

  useEffect(() => {
    if (isLoading || !organizations) {
      return;
    }

    if (organizations.length > 0) {
      router.push(`/organizations/${organizations[0].slug}/settings`);
    } else {
      router.push('organizations?newTeam=true');
    }
  }, [isLoading, router, organizations]);

  return <Loading />;
};

export async function getStaticProps({ locale }: GetServerSidePropsContext) {
  return {
    props: {
      ...(locale ? await serverSideTranslations(locale, ['common']) : {}),
    },
  };
}

export default Dashboard;

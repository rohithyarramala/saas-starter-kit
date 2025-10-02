import fetcher from '@/lib/fetcher';
import Organizations from 'pages/organizations/switch';
import useSWR, { mutate } from 'swr';
import type { ApiResponse, TeamWithMemberCount } from 'types';

const useOrganizations = () => {
  const url = `/api/organization`;

  const { data, error, isLoading } = useSWR<ApiResponse<TeamWithMemberCount[]>>(
    url,
    fetcher
  );

  const mutateOrganizations = async () => {
    mutate(url);
  };

  return {
    isLoading,
    isError: error,
    organizations: data?.data,
    mutateOrganizations,
  };
};

export default useOrganizations;

import fetcher from '@/lib/fetcher';
import type { OrganizationMember, User } from '@prisma/client';
import useSWR, { mutate } from 'swr';
import type { ApiResponse } from 'types';
import useOrganization from './useOrganization';

export type OrganizationMemberWithUser = OrganizationMember & { user: User };

const useOrganizationMembers = (slug: string) => {
  const url = `/api/organization/${slug}/members`;

  const { data, error, isLoading } = useSWR<ApiResponse<OrganizationMemberWithUser[]>>(
    url,
    fetcher
  );

  const mutateOrganizationMembers = async () => {
    mutate(url);
  };

  return {
    isLoading,
    isError: error,
    members: data?.data,
    mutateOrganizationMembers,
  };
};

export default useOrganizationMembers;

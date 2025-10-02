import { LetterAvatar } from '@/components/shared';
import { defaultHeaders } from '@/lib/common';
import { Organization } from '@prisma/client';
import useOrganizations from 'hooks/useOrganizations';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Button } from 'react-daisyui';
import toast from 'react-hot-toast';
import type { ApiResponse } from 'types';
import { useRouter } from 'next/router';
import ConfirmationDialog from '../shared/ConfirmationDialog';
import { WithLoadingAndError } from '@/components/shared';
import { CreateTeam } from '@/components/organization';
import { Table } from '@/components/shared/table/Table';

const Organizations = () => {
  const router = useRouter();
  const { t } = useTranslation('common');
  const [team, setTeam] = useState<Organization | null>(null);
  const { isLoading, isError, organizations, mutateOrganizations } = useOrganizations();
  const [askConfirmation, setAskConfirmation] = useState(false);
  const [createTeamVisible, setCreateTeamVisible] = useState(false);

  const { newTeam } = router.query as { newTeam: string };

  useEffect(() => {
    if (newTeam) {
      setCreateTeamVisible(true);
    }
  }, [newTeam]);

  const leaveTeam = async (team: Organization) => {
    const response = await fetch(`/api/organization/${team.slug}/members`, {
      method: 'PUT',
      headers: defaultHeaders,
    });

    const json = (await response.json()) as ApiResponse;

    if (!response.ok) {
      toast.error(json.error.message);
      return;
    }

    toast.success(t('leave-team-success'));
    mutateOrganizations();
  };

  return (
    <WithLoadingAndError isLoading={isLoading} error={isError}>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <div className="space-y-3">
            <h2 className="text-xl font-medium leading-none tracking-tight">
              {t('all-organizations')}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('organization-listed')}
            </p>
          </div>
          <Button
            color="primary"
            size="md"
            onClick={() => setCreateTeamVisible(!createTeamVisible)}
          >
            {t('create-organization')}
          </Button>
        </div>

        <Table
          cols={[t('name'), t('members'), t('created-at'), t('actions')]}
          body={
            organizations
              ? organizations.map((team) => {
                  return {
                    id: team.id,
                    cells: [
                      {
                        wrap: true,
                        element: (
                          <Link href={`/organizations/${team.slug}/members`}>
                            <div className="flex items-center justify-start space-x-2">
                              <LetterAvatar name={team.name} />
                              <span className="underline">{team.name}</span>
                            </div>
                          </Link>
                        ),
                      },
                      { wrap: true, text: '' + team._count.members },
                      {
                        wrap: true,
                        text: new Date(team.createdAt).toDateString(),
                      },
                      {
                        buttons: [
                          {
                            color: 'error',
                            text: t('leave-team'),
                            onClick: () => {
                              setTeam(team);
                              setAskConfirmation(true);
                            },
                          },
                        ],
                      },
                    ],
                  };
                })
              : []
          }
        ></Table>

        <ConfirmationDialog
          visible={askConfirmation}
          title={`${t('leave-organization')} ${team?.name}`}
          onCancel={() => setAskConfirmation(false)}
          onConfirm={() => {
            if (team) {
              leaveTeam(team);
            }
          }}
          confirmText={t('leave-organization')}
        >
          {t('leave-organization-confirmation')}
        </ConfirmationDialog>
        <CreateTeam
          visible={createTeamVisible}
          setVisible={setCreateTeamVisible}
        />
      </div>
    </WithLoadingAndError>
  );
};

export default Organizations;

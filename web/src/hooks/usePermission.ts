import { useProfileStore } from '@/stores';

const allRequireds = '*:*:*';

const usePermission = (requireds: string[]) => {
  const { permissions } = useProfileStore();

  return permissions.some((permission) => {
    return allRequireds === permission || requireds.includes(permission);
  });
};

export default usePermission;


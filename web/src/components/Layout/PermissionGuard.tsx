import React, { PropsWithChildren } from 'react';
import { usePermission } from '@/hooks';

const PermissionGuard: React.FC<PropsWithChildren<{ requireds: string[] }>> = ({
  requireds,
  children,
}) => {
  const permissionFlag = usePermission(requireds);
  if (permissionFlag) return children;
};

export default PermissionGuard;

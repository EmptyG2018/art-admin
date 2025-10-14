/*
 * @Author: yun.ze 491623426@qq.com
 * @Date: 2024-04-27 18:05:10
 * @LastEditors: yun.ze 491623426@qq.com
 * @LastEditTime: 2024-04-27 18:05:49
 * @FilePath: /art-admin/src/common/decorators/requires-roles.decorator.ts
 * @Description: 角色权限装饰器
 * 
 */

import { SetMetadata } from '@nestjs/common';
import { ROLES_KEY_METADATA } from '../contants/decorator.contant';
import { LogicalEnum } from '../enums/logical.enum';

export type RoleObj = {
  roleArr: string[];
  logical: LogicalEnum;
};

export const RequiresRoles = (
  roles: string | string[],
  logical: LogicalEnum = LogicalEnum.or,
) => {
  let roleObj: RoleObj = {
    roleArr: [],
    logical,
  };
  if (typeof roles === 'string') {
    roleObj = {
      roleArr: [roles],
      logical,
    };
  } else if (roles instanceof Array) {
    roleObj = {
      roleArr: roles,
      logical,
    };
  }
  return SetMetadata(ROLES_KEY_METADATA, roleObj);
};

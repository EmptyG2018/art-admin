/*
 * @Author: hu.chao 491623426@qq.com
 * @Date: 2024-05-16 19:10:45
 * @LastEditors: hu.chao 491623426@qq.com
 * @LastEditTime: 2024-05-16 20:06:39
 * @FilePath: /art-template/src/common/type/data-scope.type.ts
 * @Description: 
 * 
 */
export type DataScope = {
  deptIds: number[] | undefined;
  userName: string | undefined;
  OR: { deptId?: any; createBy?: any }[];
};

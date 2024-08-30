declare namespace Role {
  type Item = {
    roleId: number;
    createBy: string;
    createTime: string;
    dataScope: string;
    delFlag: string;
    deptCheckStrictly: boolean;
    menuCheckStrictly: boolean;
    remark: string;
    roleKey: string;
    roleName: string;
    roleSort: number;
    status: '0' | '1';
    updateBy: string;
    updateTime: string;
  };
}

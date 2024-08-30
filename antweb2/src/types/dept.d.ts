declare namespace Dept {
  type Item = {
    deptId: number;
    parentId: number;
    ancestors: string;
    deptName: string;
    orderNum: number;
    leader: string;
    phone: string;
    email: string;
    status: '0' | '1';
    delFlag: string;
    createBy: string;
    createTime: string;
    updateBy: string;
    updateTime: string;
  };
}

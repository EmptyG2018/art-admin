declare namespace User {
  type Item = {
    userId: number;
    avatar: string;
    createBy: string;
    createTime: string;
    delFlag: string;
    deptId: number;
    email: string;
    loginDate: string;
    loginIp: string;
    nickName: string;
    password: string;
    phonenumber: string;
    remark: string;
    sex: string;
    status: string;
    updateBy: string;
    updateTime: string;
    userName: string;
    userType: string;
  };
  type UserInfo = {
    permissions: string[];
    roles: string[];
    user: Item & {
      roles: Role.Item[];
      dept: Dept.Item;
      posts: Post.Item[];
      dataScope: DataScope.Item;
    };
  };
}

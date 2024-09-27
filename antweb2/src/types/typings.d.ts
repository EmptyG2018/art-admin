declare namespace API {
  type Response = {
    code: number;
    msg: string;
  };

  type PageResponse<T = any> = Response & {
    rows: T[];
    total: number;
  };

  /** Result POSt /captchaImage */
  type CaptchaImageResult = Response & {
    uuid: string;
    img: string;
  };

  /** Params POST /login */
  type LoginAccountParams = {
    uuid: string;
    username: string;
    password: string;
    code: string;
  };

  /** Result POST /login */
  type LoginAccountResult = Response & {
    token: string;
  };

  /** Result POST /login */
  type UserInfoResult = Response & User.UserInfo;

  /** Result GET /system/user/deptTree */
  type DeptTreeListResult = Response & {
    data: Dept.NodeTree[];
  };

  /** Result GET /system/user/list */
  type UserPageResult = PageResponse<User.Item & { dept: Dept.Item }>;

  /** Result GET /system/role/list */
  type RolePageResult = PageResponse<Role.Item>;

  /** Result GET /system/menu/list */
  type MenuListResult = Response & {
    data: Menu.Item[];
  };
}

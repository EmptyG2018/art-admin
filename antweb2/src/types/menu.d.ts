declare namespace Menu {
  type Item = {
    menuId: number;
    menuName: string;
    parentId: number;
    orderNum: number;
    path: string;
    component: string | null;
    query: string | null;
    isFrame: string;
    isCache: string;
    menuType: string;
    visible: string;
    status: string;
    perms: string | null;
    icon: string;
    createBy: string;
    createTime: string;
    updateBy: string;
    updateTime: string;
    remark: string;
  };
}

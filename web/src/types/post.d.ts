declare namespace Post {
  type Item = {
    postId: number;
    postCode: string;
    postName: string;
    postSort: number;
    status: string;
    createBy: string;
    createTime: string;
    updateBy: string;
    updateTime: string | null;
    remark: string | null;
  };
}

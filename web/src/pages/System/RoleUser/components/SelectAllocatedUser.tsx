import React, { useState } from 'react';
import { Modal } from 'antd';
import { ProColumns, ProTable } from '@ant-design/pro-components';
import { queryDictsByType } from '@/services/dict';
import { getUnAllocatedUserList } from '@/services/user';
import { updateAuthUser } from '@/services/role';

export const columns: ProColumns[] = [
  {
    title: '用户名称',
    dataIndex: 'userName',
    valueType: 'text',
    width: 140,
  },
  {
    title: '用户昵称',
    dataIndex: 'nickName',
    valueType: 'text',
    width: 180,
    hideInSearch: true,
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    valueType: 'text',
    hideInSearch: true,
  },
  {
    title: '手机号码',
    dataIndex: 'phonenumber',
    width: 220,
  },
  {
    title: '状态',
    dataIndex: 'status',
    valueType: 'radio',
    hideInSearch: true,
    initialValue: '0',
    width: 120,
    request: async () => {
      const res = await queryDictsByType('sys_normal_disable');
      return res.data.map((dict) => ({
        label: dict.dictLabel,
        value: dict.dictValue,
      }));
    },
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    valueType: 'dateTime',
    width: 220,
    hideInSearch: true,
    hideInForm: true,
  },
];

const SelectAllocatedUserTable: React.FC<{
  roleId: number;
  onSelectionChange: (args: any) => any;
}> = ({ roleId, onSelectionChange }) => {
  return (
    <ProTable
      headerTitle="查询表格"
      rowKey="userId"
      request={async (params, sorter, filter) => {
        const { code, rows, total } = await getUnAllocatedUserList({
          roleId,
          ...params,
          // FIXME: remove @ts-ignore
          // @ts-ignore
          sorter,
          filter,
        });
        return {
          data: rows,
          total,
          success: code === 200,
        };
      }}
      columns={columns}
      pagination={{
        current: 1,
        pageSize: 15,
      }}
      rowSelection={{
        onChange: onSelectionChange,
      }}
      scroll={{ x: 1200 }}
    />
  );
};

const SelectAllocatedUser = (props) => {
  const { trigger, roleId, onFinish, ...rest } = props;
  const [visible, setVisible] = useState<boolean>(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<API.UserInfo[]>([]);

  return (
    <>
      {React.cloneElement(trigger, {
        onClick: () => setVisible(true),
      })}
      <Modal
        open={visible}
        title="选择用户"
        width={1000}
        destroyOnHidden
        okButtonProps={{
          disabled: !selectedRowKeys.length,
        }}
        onCancel={() => setVisible(false)}
        onOk={async () => {
          await updateAuthUser({
            roleId,
            userIds: selectedRowKeys.join(','),
          });
          await onFinish?.();
          setVisible(false);
        }}
      >
        <SelectAllocatedUserTable
          roleId={roleId}
          onSelectionChange={(selectedRowKeys) =>
            setSelectedRowKeys(selectedRowKeys)
          }
          {...rest}
        />
      </Modal>
    </>
  );
};

export default SelectAllocatedUser;

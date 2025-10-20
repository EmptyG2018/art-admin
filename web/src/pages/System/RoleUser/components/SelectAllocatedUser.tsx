import React, { useState } from 'react';
import { Modal } from 'antd';
import { ProColumns, ProTable } from '@ant-design/pro-components';
import { rawT, T } from '@/locales';
import { queryDictsByType } from '@/services/dict';
import { getUnAllocatedUserList } from '@/services/user';
import { updateAuthUser } from '@/services/role';

export const columns: ProColumns[] = [
  {
    title: <T id="page.role.field.userName" />,
    dataIndex: 'userName',
    valueType: 'text',
    width: 140,
  },
  {
    title: <T id="page.role.field.nickName" />,
    dataIndex: 'nickName',
    valueType: 'text',
    width: 180,
    hideInSearch: true,
  },
  {
    title: <T id="page.role.field.email" />,
    dataIndex: 'email',
    valueType: 'text',
    hideInSearch: true,
  },
  {
    title: <T id="page.role.field.phone" />,
    dataIndex: 'phonenumber',
    width: 220,
  },
  {
    title: <T id="component.field.status" />,
    dataIndex: 'status',
    valueType: 'radio',
    hideInSearch: true,
    initialValue: '0',
    width: 120,
    request: async () => {
      const res = await queryDictsByType('sys_normal_disable');
      return res.data.map((dict) => ({
        label: dict.i18nKey ? rawT(dict.i18nKey) : dict.dictLabel,
        value: dict.dictValue,
      }));
    },
  },
  {
    title: <T id="component.field.createTime" />,
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
      headerTitle={<T id="component.table.title" />}
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
        defaultPageSize: 12,
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
        title={<T id="page.role.selectUser" />}
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

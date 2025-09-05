import React, { useRef, useState } from 'react';
import { Button, message, Dropdown, Modal } from 'antd';
import {
  ExportOutlined,
  EllipsisOutlined,
  ClearOutlined,
} from '@ant-design/icons';
import {
  ActionType,
  FooterToolbar,
  PageContainer,
  ProTable,
  ProColumns,
} from '@ant-design/pro-components';
import { queryDictsByType } from '@/services/dict';
import {
  queryLogininforPage,
  deleteLogininfor,
  cleanLogininfor,
} from '@/services/log';

/**
 *  删除节点
 * @param selectedRows
 */
const handleRemove = async (selectedRows: API.UserInfo[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    await deleteLogininfor(selectedRows.map((row) => row.infoId).join(','));
    hide();
    message.success('删除成功');
    return true;
  } catch {
    hide();
    message.error('删除失败请重试!');
    return false;
  }
};

export const Component: React.FC<unknown> = () => {
  const actionRef = useRef<ActionType>();
  const [selectedRowsState, setSelectedRows] = useState<API.UserInfo[]>([]);
  const columns: ProColumns[] = [
    {
      title: '访问编号',
      dataIndex: 'infoId',
      width: 140,
      hideInSearch: true,
    },
    {
      title: '用户名称',
      dataIndex: 'userName',
      valueType: 'text',
      width: 180,
    },
    {
      title: '登录IP',
      dataIndex: 'ipaddr',
      valueType: 'text',
      width: 180,
    },
    {
      title: '登录地址',
      dataIndex: 'loginLocation',
      valueType: 'text',
      width: 180,
      hideInSearch: true,
    },
    {
      title: '操作系统',
      dataIndex: 'os',
      valueType: 'text',
      width: 180,
      hideInSearch: true,
    },
    {
      title: '浏览器',
      dataIndex: 'browser',
      valueType: 'text',
      width: 180,
      hideInSearch: true,
    },
    {
      title: '执行状态',
      dataIndex: 'status',
      valueType: 'select',
      width: 120,
      request: async () => {
        const res = await queryDictsByType('sys_common_status');
        return res.data.map((dict) => ({
          label: dict.dictLabel,
          value: dict.dictValue,
        }));
      },
    },
    {
      title: '登录时间',
      dataIndex: 'loginTime',
      valueType: 'dateTime',
      width: 220,
    },
  ];

  return (
    <PageContainer
      header={{
        title: '登录日志',
      }}
    >
      <ProTable
        headerTitle="查询表格"
        actionRef={actionRef}
        rowKey="infoId"
        toolBarRender={() => [
          <Button
            icon={<ClearOutlined />}
            key="clear"
            onClick={() => {
              Modal.confirm({
                title: '删除记录',
                content: '您确定要清空全部记录吗？',
                onOk: async () => {
                  try {
                    await cleanLogininfor();
                    actionRef.current?.reloadAndRest?.();
                    Promise.resolve();
                  } catch {
                    Promise.reject();
                  }
                },
              });
            }}
          >
            清空
          </Button>,
          <Dropdown
            menu={{
              items: [
                {
                  label: '导出',
                  icon: <ExportOutlined />,
                  key: 'export',
                },
              ],
            }}
            key="menu"
          >
            <Button>
              <EllipsisOutlined />
            </Button>
          </Dropdown>,
        ]}
        request={async (params, sorter, filter) => {
          const { code, rows, total } = await queryLogininforPage({
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
          onChange: (_, selectedRows) => setSelectedRows(selectedRows),
        }}
        scroll={{ x: 1400 }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              已选择{' '}
              <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a>{' '}
              项&nbsp;&nbsp;
            </div>
          }
        >
          <Button
            onClick={async () => {
              Modal.confirm({
                title: '删除记录',
                content: '您确定要删除选中的记录吗？',
                onOk: async () => {
                  const ok = await handleRemove(selectedRowsState);
                  if (ok) {
                    setSelectedRows([]);
                    actionRef.current?.reloadAndRest?.();
                    Promise.resolve();
                  } else {
                    Promise.reject();
                  }
                },
              });
            }}
          >
            批量删除
          </Button>
        </FooterToolbar>
      )}
    </PageContainer>
  );
};

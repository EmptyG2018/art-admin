import React, { useRef, useState } from 'react';
import {
  Button,
  Divider,
  Space,
  message,
  Dropdown,
  Tooltip,
  Modal,
} from 'antd';
import {
  ExportOutlined,
  EllipsisOutlined,
  EyeOutlined,
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
import { queryOperlogPage, deleteOperlog, cleanOperlog } from '@/services/log';
import ViewOperlog from './components/ViewOperlog';

/**
 *  删除节点
 * @param selectedRows
 */
const handleRemove = async (selectedRows: API.UserInfo[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    await deleteOperlog(selectedRows.map((row) => row.operId).join(','));
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
      title: '日志编号',
      dataIndex: 'operId',
      hideInSearch: true,
      width: 140,
    },
    {
      title: '系统模块',
      dataIndex: 'title',
      valueType: 'text',
      width: 180,
    },
    {
      title: '请求动作',
      dataIndex: 'businessType',
      valueType: 'select',
      width: 180,
      request: async () => {
        const res = await queryDictsByType('sys_oper_type');
        return res.data.map((dict) => ({
          label: dict.dictLabel,
          value: dict.dictValue,
        }));
      },
    },
    {
      title: '操作人员',
      dataIndex: 'operName',
      valueType: 'text',
      width: 180,
    },
    {
      title: 'IP地址',
      dataIndex: 'operIp',
      valueType: 'text',
      width: 180,
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
      title: '耗时(ms)',
      dataIndex: 'costTime',
      valueType: 'text',
      hideInSearch: true,
      width: 120,
    },
    {
      title: '操作时间',
      dataIndex: 'operTime',
      valueType: 'dateTime',
      width: 220,
    },
    {
      title: '操作',
      width: 60,
      dataIndex: 'option',
      valueType: 'option',
      fixed: 'right',
      render: (_, record) => (
        <Space
          direction="horizontal"
          split={<Divider type="vertical" />}
          size={2}
        >
          <ViewOperlog
            values={record}
            trigger={
              <Tooltip title="查看">
                <Button type="link" size="small" icon={<EyeOutlined />} />
              </Tooltip>
            }
          />
        </Space>
      ),
    },
  ];

  return (
    <PageContainer
      header={{
        title: '操作日志',
      }}
    >
      <ProTable
        headerTitle="查询表格"
        actionRef={actionRef}
        rowKey="operId"
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
                    await cleanOperlog();
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
          const { code, rows, total } = await queryOperlogPage({
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

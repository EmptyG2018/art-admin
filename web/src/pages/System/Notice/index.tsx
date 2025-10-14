import React, { useRef, useState } from 'react';
import { Button, Space, message, Tooltip, Popconfirm, Modal, Form } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import {
  ActionType,
  FooterToolbar,
  PageContainer,
  ProTable,
  ProColumns,
  ProFormText,
  ProFormSelect,
  ProFormRadio,
} from '@ant-design/pro-components';
import { queryDictsByType } from '@/services/dict';
import { queryNoticePage, deleteNotice } from '@/services/notice';
import { WangEdtior } from '@/components';
import CreateNoticeForm from './components/CreateNoticeForm';
import UpdateNoticeForm from './components/UpdateNoticeForm';

/**
 *  删除节点
 * @param selectedRows
 */
const handleRemove = async (selectedRows: API.UserInfo[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    await deleteNotice(selectedRows.map((row) => row.noticeId).join(','));
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
      title: '序号',
      dataIndex: 'noticeId',
      hideInSearch: true,
      width: 80,
    },
    {
      title: '公告标题',
      dataIndex: 'noticeTitle',
      valueType: 'text',
    },
    {
      title: '公告类型',
      dataIndex: 'noticeType',
      valueType: 'select',
      width: 120,
      request: async () => {
        const res = await queryDictsByType('sys_notice_type');
        return res.data.map((dict) => ({
          label: dict.dictLabel,
          value: dict.dictValue,
        }));
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueType: 'select',
      width: 120,
      hideInSearch: true,
      request: async () => {
        const res = await queryDictsByType('sys_notice_status');
        return res.data.map((dict) => ({
          label: dict.dictLabel,
          value: dict.dictValue,
        }));
      },
    },
    {
      title: '创建者',
      dataIndex: 'createBy',
      valueType: 'text',
      width: 180,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      width: 220,
      hideInSearch: true,
      hideInForm: true,
    },
    {
      title: '操作',
      width: 100,
      dataIndex: 'option',
      valueType: 'option',
      fixed: 'right',
      render: (_, record) => (
        <Space direction="horizontal" size={16}>
          <UpdateNoticeForm
            values={record}
            formRender={formRender}
            trigger={
              <Tooltip title="修改">
                <Button type="link" size="small" icon={<EditOutlined />} />
              </Tooltip>
            }
            onFinish={() => {
              actionRef.current?.reload();
            }}
          />
          <Tooltip title="删除">
            <Popconfirm
              title="删除记录"
              description="您确定要删除此记录吗？"
              onConfirm={async () => {
                await handleRemove([record]);
                actionRef.current?.reloadAndRest?.();
              }}
            >
              <Button type="link" size="small" icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  const formRender = (
    <>
      <ProFormText
        name="noticeTitle"
        label="公告标题"
        placeholder="请输入公告标题"
        rules={[{ required: true, message: '请输入公告标题' }]}
        width="xl"
      />
      <ProFormSelect
        name="noticeType"
        label="公告类型"
        placeholder="请选择公告类型"
        request={async () => {
          const res = await queryDictsByType('sys_notice_type');
          return res.data.map((dict) => ({
            label: dict.dictLabel,
            value: dict.dictValue,
          }));
        }}
        rules={[{ required: true, message: '请选择公告类型' }]}
        width="sm"
      />
      <Form.Item name="noticeContent" label="内容">
        <WangEdtior />
      </Form.Item>
      <ProFormRadio.Group
        name="status"
        label="状态"
        placeholder="请选择状态"
        initialValue="0"
        request={async () => {
          const res = await queryDictsByType('sys_notice_status');
          return res.data.map((dict) => ({
            label: dict.dictLabel,
            value: dict.dictValue,
          }));
        }}
      />
    </>
  );

  return (
    <PageContainer
      header={{
        title: '通知公告',
      }}
    >
      <ProTable
        headerTitle="查询表格"
        actionRef={actionRef}
        rowKey="noticeId"
        toolBarRender={() => [
          <CreateNoticeForm
            formRender={formRender}
            trigger={
              <Button type="primary" icon={<PlusOutlined />} key="add">
                新建
              </Button>
            }
            onFinish={() => {
              actionRef.current?.reload();
            }}
          />,
        ]}
        request={async (params, sorter, filter) => {
          const { code, rows, total } = await queryNoticePage({
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

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
import { PermissionGuard } from '@/components/Layout';
import { rawT, useT, T } from '@/locales';
import { WangEdtior } from '@/components';
import CreateNoticeForm from './components/CreateNoticeForm';
import UpdateNoticeForm from './components/UpdateNoticeForm';

/**
 *  删除节点
 * @param selectedRows
 */
const handleRemove = async (selectedRows: API.UserInfo[]) => {
  const hide = message.loading(rawT('component.form.message.delete.loading'));
  if (!selectedRows) return true;
  try {
    await deleteNotice(selectedRows.map((row) => row.noticeId).join(','));
    hide();
    message.success(rawT('component.form.message.delete.success'));
    return true;
  } catch {
    hide();
    message.success(rawT('component.form.message.delete.error'));
    return false;
  }
};

export const Component: React.FC<unknown> = () => {
  const t = useT();
  const actionRef = useRef<ActionType>();
  const [selectedRowsState, setSelectedRows] = useState<API.UserInfo[]>([]);

  const columns: ProColumns[] = [
    {
      title: <T id="page.notice.field.order" />,
      dataIndex: 'noticeId',
      hideInSearch: true,
      width: 80,
    },
    {
      title: <T id="page.notice.field.title" />,
      dataIndex: 'noticeTitle',
      valueType: 'text',
    },
    {
      title: <T id="page.notice.field.type" />,
      dataIndex: 'noticeType',
      valueType: 'select',
      width: 120,
      request: async () => {
        const res = await queryDictsByType('sys_notice_type');
        return res.data.map((dict) => ({
          label: dict.i18nKey ? t(dict.i18nKey) : dict.dictLabel,
          value: dict.dictValue,
        }));
      },
    },
    {
      title: <T id="component.field.status" />,
      dataIndex: 'status',
      valueType: 'select',
      width: 120,
      hideInSearch: true,
      request: async () => {
        const res = await queryDictsByType('sys_notice_status');
        return res.data.map((dict) => ({
          label: dict.i18nKey ? t(dict.i18nKey) : dict.dictLabel,
          value: dict.dictValue,
        }));
      },
    },
    {
      title: <T id="component.field.createBy" />,
      dataIndex: 'createBy',
      valueType: 'text',
      width: 180,
    },
    {
      title: <T id="component.field.createTime" />,
      dataIndex: 'createTime',
      valueType: 'dateTime',
      width: 220,
      hideInSearch: true,
      hideInForm: true,
    },
    {
      title: <T id="component.table.action" />,
      width: 100,
      dataIndex: 'option',
      valueType: 'option',
      fixed: 'right',
      render: (_, record) => (
        <Space direction="horizontal" size={16}>
          <PermissionGuard requireds={['system:notice:edit']}>
            <UpdateNoticeForm
              values={record}
              formRender={formRender}
              trigger={
                <Tooltip title={<T id="component.tooltip.update" />}>
                  <Button type="link" size="small" icon={<EditOutlined />} />
                </Tooltip>
              }
              onFinish={() => {
                actionRef.current?.reload();
              }}
            />
          </PermissionGuard>
          <PermissionGuard requireds={['system:notice:remove']}>
            <Tooltip title={<T id="component.tooltip.delete" />}>
              <Popconfirm
                title={<T id="component.confirm.delete" />}
                description={<T id="component.confirm.delete.desc" />}
                onConfirm={async () => {
                  await handleRemove([record]);
                  actionRef.current?.reloadAndRest?.();
                }}
              >
                <Button type="link" size="small" icon={<DeleteOutlined />} />
              </Popconfirm>
            </Tooltip>
          </PermissionGuard>
        </Space>
      ),
    },
  ];

  const formRender = (
    <>
      <ProFormText
        name="noticeTitle"
        label={<T id="page.notice.field.title" />}
        placeholder={t('component.form.placeholder', {
          label: t('page.notice.field.title'),
        })}
        rules={[
          {
            required: true,
            message: t('component.form.placeholder', {
              label: t('page.notice.field.title'),
            }),
          },
        ]}
        width="xl"
      />
      <ProFormSelect
        name="noticeType"
        label={<T id="page.notice.field.type" />}
        placeholder={t('component.form.placeholder.sel', {
          label: t('page.notice.field.type'),
        })}
        request={async () => {
          const res = await queryDictsByType('sys_notice_type');
          return res.data.map((dict) => ({
            label: dict.i18nKey ? t(dict.i18nKey) : dict.dictLabel,
            value: dict.dictValue,
          }));
        }}
        rules={[
          {
            required: true,
            message: t('component.form.placeholder.sel', {
              label: t('page.notice.field.type'),
            }),
          },
        ]}
        width="sm"
      />
      <Form.Item
        name="noticeContent"
        label={<T id="page.notice.field.content" />}
      >
        <WangEdtior />
      </Form.Item>
      <ProFormRadio.Group
        name="status"
        label={<T id="component.field.status" />}
        placeholder={t('component.field.status.placeholder')}
        initialValue="0"
        request={async () => {
          const res = await queryDictsByType('sys_notice_status');
          return res.data.map((dict) => ({
            label: dict.i18nKey ? t(dict.i18nKey) : dict.dictLabel,
            value: dict.dictValue,
          }));
        }}
      />
    </>
  );

  return (
    <PageContainer
      header={{
        title: <T id="menu.system.notice" />,
      }}
    >
      <ProTable
        headerTitle={<T id="component.table.title" />}
        actionRef={actionRef}
        rowKey="noticeId"
        toolBarRender={() => [
          <PermissionGuard requireds={['system:notice:add']}>
            <CreateNoticeForm
              formRender={formRender}
              trigger={
                <Button type="primary" icon={<PlusOutlined />} key="add">
                  <T id="component.table.tool.add" />
                </Button>
              }
              onFinish={() => {
                actionRef.current?.reload();
              }}
            />
          </PermissionGuard>,
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
              <T
                id="component.table.selection"
                values={{
                  num: (
                    <a style={{ fontWeight: 600 }}>
                      {selectedRowsState.length}
                    </a>
                  ),
                }}
              />
            </div>
          }
        >
          <PermissionGuard requireds={['system:notice:remove']}>
            <Button
              onClick={async () => {
                Modal.confirm({
                  title: t('component.confirm.delete'),
                  content: t('component.confirm.delete.desc'),
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
              <T id="component.table.tool.batchdelete" />
            </Button>
          </PermissionGuard>
        </FooterToolbar>
      )}
    </PageContainer>
  );
};

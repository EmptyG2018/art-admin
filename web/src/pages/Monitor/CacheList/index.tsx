import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react';
import {
  Space,
  Button,
  Row,
  Col,
  Tooltip,
  Popconfirm,
  Form,
  Input,
  message,
  Modal,
} from 'antd';
import { DeleteOutlined, ClearOutlined } from '@ant-design/icons';
import type { ProColumns } from '@ant-design/pro-components';
import {
  ActionType,
  PageContainer,
  ProCard,
  ProTable,
  ProFormText,
  DrawerForm,
} from '@ant-design/pro-components';
import { useResponsive } from 'ahooks';
import { createStyles } from 'antd-style';
import { rawT, useT, T } from '@/locales';
import {
  queryCacheList,
  queryCacheKeyList,
  queryCacheValue,
  deleteCacheName,
  deleteCacheKey,
  cleanCache,
} from '@/services/monitor';

const useStyles = createStyles(({ token }) => {
  return {
    rowSelected: {
      background: token.colorPrimaryBg,
    },
  };
});

type CacheKey = {
  cacheKey: string;
};

type CacheKeyListProps = {
  cacheName: string;
};

const CacheKeyList: React.FC<CacheKeyListProps> = ({ cacheName }) => {
  const t = useT();
  const actionRef = useRef<ActionType>();
  const { styles } = useStyles();
  const [selectedRowKey, setSelectedRowKey] = useState<string>('');
  const [drawerVisible, setDrawerVisible] = useState(false);

  useEffect(() => {
    setSelectedRowKey('');
  }, [cacheName]);

  const columns: ProColumns<CacheKey>[] = [
    {
      title: <T id="page.cache.field.cacheKey" />,
      dataIndex: 'cacheKey',
      valueType: 'text',
    },
    {
      title: <T id="component.table.action" />,
      key: 'option',
      width: 60,
      valueType: 'option',
      fixed: 'right',
      render: (_, record) => {
        return (
          <Space direction="horizontal" size={16}>
            <Tooltip title={<T id="component.tooltip.delete" />}>
              <Popconfirm
                title={<T id="component.confirm.delete" />}
                description={<T id="component.confirm.delete.desc" />}
                onPopupClick={(e) => e.stopPropagation()}
                onConfirm={async () => {
                  const hide = message.loading(
                    t('component.form.message.delete.loading'),
                  );
                  try {
                    await deleteCacheKey(record.cacheKey);
                    hide();
                    message.success(t('component.form.message.delete.success'));
                    setSelectedRowKey('');
                    actionRef.current?.reloadAndRest?.();
                    return true;
                  } catch {
                    hide();
                    message.error(t('component.form.message.delete.error'));
                    return false;
                  }
                }}
              >
                <Button
                  type="link"
                  size="small"
                  icon={<DeleteOutlined />}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                />
              </Popconfirm>
            </Tooltip>
          </Space>
        );
      },
    },
  ];

  const rowClassName = (record: CacheKey) =>
    record.cacheKey === selectedRowKey ? styles.rowSelected : '';

  return (
    <>
      <ProTable<CacheKey>
        actionRef={actionRef}
        rowKey="cacheKey"
        search={false}
        toolBarRender={false}
        columns={columns}
        params={{ cacheName }}
        request={async (params) => {
          if (!params.cacheName) return { data: [], success: true };

          const { code, data } = await queryCacheKeyList(params.cacheName);
          return {
            data: data.map((it: CacheKey) => ({ cacheKey: it })),
            success: code === 200,
          };
        }}
        rowClassName={rowClassName}
        rowHoverable={false}
        pagination={false}
        scroll={{ x: 400, y: 600 }}
        onRow={(record) => ({
          onClick: () => {
            setSelectedRowKey(record.cacheKey);
            setDrawerVisible(true);
          },
        })}
      />
      <DrawerForm
        open={drawerVisible}
        title={<T id="page.cache.detail" />}
        width={378}
        readonly
        request={async () => {
          const res = await queryCacheValue(cacheName, selectedRowKey);
          return res.data;
        }}
        drawerProps={{
          destroyOnHidden: true,
          maskClosable: true,
          onClose: () => setDrawerVisible(false),
        }}
        submitter={false}
      >
        <ProFormText
          name="cacheName"
          label={<T id="page.cache.field.cacheName" />}
        />
        <ProFormText
          name="cacheKey"
          label={<T id="page.cache.field.cacheKey" />}
        />
        <Form.Item
          name="cacheValue"
          label={<T id="page.cache.field.cacheValue" />}
        >
          <Input.TextArea rows={20} readOnly />
        </Form.Item>
      </DrawerForm>
    </>
  );
};

export type Cache = {
  cacheName: string;
  remark: string;
};

type CacheListProps = {
  cacheName: string;
  onChange: (cacheName: string) => void;
};

const CacheList: React.FC<CacheListProps> = forwardRef(
  ({ cacheName, onChange }, ref) => {
    const t = useT();
    const actionRef = useRef<ActionType>();
    const { styles } = useStyles();

    useImperativeHandle(ref, () => {
      return {
        reload: () => {
          onChange('');
          actionRef.current?.reloadAndRest?.();
        },
      };
    });

    const rowClassName = (record: Cache) =>
      record.cacheName === cacheName ? styles.rowSelected : '';

    const columns: ProColumns<Cache>[] = [
      {
        title: <T id="page.cache.field.cacheName" />,
        dataIndex: 'cacheName',
        valueType: 'text',
        width: 220,
      },
      {
        title: <T id="component.field.remark" />,
        dataIndex: 'remark',
        valueType: 'text',
      },
      {
        title: <T id="component.field.remark" />,
        key: 'option',
        width: 60,
        valueType: 'option',
        fixed: 'right',
        render: (_, record) => {
          return (
            <Space direction="horizontal" size={16}>
              <Tooltip title={<T id="component.tooltip.delete" />}>
                <Popconfirm
                  title={<T id="component.confirm.delete" />}
                  description={<T id="component.confirm.delete.desc" />}
                  onConfirm={async () => {
                    const hide = message.loading(
                      t('component.form.message.delete.loading'),
                    );
                    try {
                      await deleteCacheName(record.cacheName);
                      hide();
                      message.success(
                        t('component.form.message.delete.success'),
                      );
                      onChange('');
                      actionRef.current?.reloadAndRest?.();
                      return true;
                    } catch {
                      hide();
                      message.error(t('component.form.message.delete.error'));
                      return false;
                    }
                  }}
                >
                  <Button type="link" size="small" icon={<DeleteOutlined />} />
                </Popconfirm>
              </Tooltip>
            </Space>
          );
        },
      },
    ];
    return (
      <ProTable<Cache>
        actionRef={actionRef}
        rowKey="cacheName"
        search={false}
        options={false}
        columns={columns}
        request={async (params, sorter, filter) => {
          const { code, data } = await queryCacheList({
            ...params,
            sorter,
            filter,
          });
          return {
            data,
            success: code === 200,
          };
        }}
        rowClassName={rowClassName}
        rowHoverable={false}
        pagination={false}
        onRow={(record: Cache) => ({
          onClick: () => {
            if (record.cacheName !== cacheName) {
              onChange(record.cacheName);
            }
          },
        })}
        scroll={{ x: 520 }}
      />
    );
  },
);

export const Component: React.FC = () => {
  const t = useT();
  const ref = useRef<ActionType>();
  const responsive = useResponsive();
  const [cacheName, setCacheName] = useState<string>('');
  return (
    <PageContainer
      header={{
        title: <T id="menu.monitor.cacheList" />,
        extra: (
          <Button
            icon={<ClearOutlined />}
            onClick={() => {
              Modal.confirm({
                title: t('component.confirm.clear'),
                content: t('component.confirm.clear.desc'),
                onOk: async () => {
                  const hide = message.loading(
                    t('component.form.message.delete.loading'),
                  );
                  try {
                    await cleanCache();
                    hide();
                    message.success(t('component.form.message.delete.success'));
                    ref.current?.reload?.();
                    Promise.resolve();
                  } catch {
                    hide();
                    message.error(t('component.form.message.delete.error'));
                    Promise.reject();
                  }
                },
              });
            }}
          >
            <T id="page.cache.clear" />
          </Button>
        ),
      }}
    >
      <Row wrap={!responsive.md} gutter={[20, 20]}>
        <Col flex={responsive.md ? '420px' : 'auto'}>
          <ProCard>
            <CacheList
              ref={ref}
              cacheName={cacheName}
              onChange={(v) => setCacheName(v)}
            />
          </ProCard>
        </Col>
        <Col flex="auto">
          <ProCard>
            <CacheKeyList cacheName={cacheName} />
          </ProCard>
        </Col>
      </Row>
    </PageContainer>
  );
};

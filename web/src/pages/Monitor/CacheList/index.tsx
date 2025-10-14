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
  const actionRef = useRef<ActionType>();
  const { styles } = useStyles();
  const [selectedRowKey, setSelectedRowKey] = useState<string>('');
  const [drawerVisible, setDrawerVisible] = useState(false);

  useEffect(() => {
    setSelectedRowKey('');
  }, [cacheName]);

  const columns: ProColumns<CacheKey>[] = [
    {
      title: '缓存键名',
      dataIndex: 'cacheKey',
      valueType: 'text',
    },
    {
      title: '操作',
      key: 'option',
      width: 60,
      valueType: 'option',
      fixed: 'right',
      render: (_, record) => {
        return (
          <Space direction="horizontal" size={16}>
            <Tooltip title="删除">
              <Popconfirm
                title="删除记录"
                description="您确定要删除此记录吗？"
                onPopupClick={(e) => e.stopPropagation()}
                onConfirm={async () => {
                  const hide = message.loading('正在删除');
                  try {
                    await deleteCacheKey(record.cacheKey);
                    hide();
                    message.success('删除成功');
                    setSelectedRowKey('');
                    actionRef.current?.reloadAndRest?.();
                    return true;
                  } catch {
                    hide();
                    message.error('删除失败请重试!');
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
        title="缓存详情"
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
        <ProFormText name="cacheName" label="缓存名称" />
        <ProFormText name="cacheKey" label="缓存键名" />
        <Form.Item name="cacheValue" label="缓存键值">
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
        title: '缓存名称',
        dataIndex: 'cacheName',
        valueType: 'text',
        width: 220,
      },
      {
        title: '备注',
        dataIndex: 'remark',
        valueType: 'text',
      },
      {
        title: '操作',
        key: 'option',
        width: 60,
        valueType: 'option',
        fixed: 'right',
        render: (_, record) => {
          return (
            <Space direction="horizontal" size={16}>
              <Tooltip title="删除">
                <Popconfirm
                  title="删除记录"
                  description="您确定要删除此记录吗？"
                  onConfirm={async () => {
                    const hide = message.loading('正在删除');
                    try {
                      await deleteCacheName(record.cacheName);
                      hide();
                      message.success('删除成功');
                      onChange('');
                      actionRef.current?.reloadAndRest?.();
                      return true;
                    } catch {
                      hide();
                      message.error('删除失败请重试!');
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
  const ref = useRef<ActionType>();
  const responsive = useResponsive();
  const [cacheName, setCacheName] = useState<string>('');
  return (
    <PageContainer
      header={{
        title: '缓存列表',
        extra: (
          <Popconfirm
            title="清空记录"
            description="您确定要清空记录吗？"
            onConfirm={async () => {
              const hide = message.loading('正在清空');
              try {
                await cleanCache();
                hide();
                message.success('清空成功');
                ref.current?.reload?.();
                return true;
              } catch {
                hide();
                message.error('清空失败请重试!');
                return false;
              }
            }}
          >
            <Button icon={<ClearOutlined />}>清空缓存</Button>
          </Popconfirm>
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

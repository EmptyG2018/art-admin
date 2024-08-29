import { CrownFilled, SmileFilled, TabletFilled } from '@ant-design/icons';

export default {
  route: {
    path: '/',
    routes: [
      {
        path: '/welcome',
        name: '欢迎',
        icon: <SmileFilled />,
      },
      {
        path: '/admin',
        name: '管理页',
        icon: <CrownFilled />,
        access: 'canAdmin',
        routes: [
          {
            path: '/admin/sub-page1',
            name: '一级页面',
            icon: 'https://gw.alipayobjects.com/zos/antfincdn/upvrAjAPQX/Logo_Tech%252520UI.svg',
          },
          {
            path: '/admin/sub-page2',
            name: '二级页面',
            icon: <CrownFilled />,
          },
          {
            path: '/admin/sub-page3',
            name: '三级页面',
            icon: <CrownFilled />,
          },
        ],
      },
      {
        name: '列表页',
        icon: <TabletFilled />,
        path: '/list',
        routes: [
          {
            path: '/list/sub-page',
            name: '列表页面',
            icon: <CrownFilled />,
            routes: [
              {
                path: 'sub-sub-page1',
                name: '一一级列表页面',
                icon: <CrownFilled />,
              },
              {
                path: 'sub-sub-page2',
                name: '一二级列表页面',
                icon: <CrownFilled />,
              },
              {
                path: 'sub-sub-page3',
                name: '一三级列表页面',
                icon: <CrownFilled />,
              },
            ],
          },
          {
            path: '/list/sub-page2',
            name: '二级列表页面',
            icon: <CrownFilled />,
          },
          {
            path: '/list/sub-page3',
            name: '三级列表页面',
            icon: <CrownFilled />,
          },
        ],
      },
    ],
  },
  location: {
    pathname: '/',
  },
};

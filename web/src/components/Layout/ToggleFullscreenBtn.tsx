import { useState, useEffect } from 'react';
import { Button, Tooltip } from 'antd';
import { FullscreenOutlined, FullscreenExitOutlined } from '@ant-design/icons';

// 全屏兼容性工具函数
const Fullscreen = {
  // 检查是否支持全屏
  isEnabled() {
    return !!(
      document.fullscreenEnabled ||
      document.webkitFullscreenEnabled ||
      document.mozFullScreenEnabled ||
      document.msFullscreenEnabled
    );
  },

  // 获取当前全屏元素
  getFullscreenElement() {
    return (
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement ||
      null
    );
  },

  // 进入全屏
  request(element) {
    if (element.requestFullscreen) {
      return element.requestFullscreen();
    } else if (element.webkitRequestFullscreen) {
      return element.webkitRequestFullscreen();
    } else if (element.mozRequestFullScreen) {
      return element.mozRequestFullScreen();
    } else if (element.msRequestFullscreen) {
      return element.msRequestFullscreen();
    }
    return Promise.reject(new Error('Fullscreen API not available'));
  },

  // 退出全屏
  exit() {
    if (document.exitFullscreen) {
      return document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      return document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      return document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
      return document.msExitFullscreen();
    }
    return Promise.reject(new Error('Fullscreen API not available'));
  },

  // 监听全屏变化
  on(_, handler) {
    document.addEventListener('fullscreenchange', handler);
    document.addEventListener('webkitfullscreenchange', handler);
    document.addEventListener('mozfullscreenchange', handler);
    document.addEventListener('MSFullscreenChange', handler); // 注意大小写
  },

  // 移除监听
  off(_, handler) {
    document.removeEventListener('fullscreenchange', handler);
    document.removeEventListener('webkitfullscreenchange', handler);
    document.removeEventListener('mozfullscreenchange', handler);
    document.removeEventListener('MSFullscreenChange', handler);
  },
};

// 全屏切换按钮组件
const ToggleFullscreenBtn = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  // 检查是否支持全屏
  const [isSupported] = useState(Fullscreen.isEnabled());

  useEffect(() => {
    const handleChange = () => {
      setIsFullscreen(!!Fullscreen.getFullscreenElement());
    };

    if (isSupported) {
      Fullscreen.on('change', handleChange);
      // 初始化状态
      handleChange();
    }

    return () => {
      if (isSupported) {
        Fullscreen.off('change', handleChange);
      }
    };
  }, [isSupported]);

  const toggle = () => {
    if (!isSupported) {
      console.error('当前浏览器不支持全屏功能');
      return;
    }

    if (!Fullscreen.getFullscreenElement()) {
      Fullscreen.request(document.documentElement).catch((err) => {
        console.error('进入全屏失败:', err);
      });
    } else {
      Fullscreen.exit().catch((err) => {
        console.error('退出全屏失败:', err);
      });
    }
  };

  if (!isSupported) {
    return null; // 或者显示“不支持”提示
  }

  return (
    <Tooltip title={isFullscreen ? '退出全屏' : '进入全屏'}>
      <Button
        type="text"
        icon={
          isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />
        }
        onClick={toggle}
      />
    </Tooltip>
  );
};

export default ToggleFullscreenBtn;

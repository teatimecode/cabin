"use client";

import React from 'react';
import { Button, List } from '@react95/core';
import { getIcon } from '../components/icons';
import type { WindowInstance } from '../components/window/WindowManager';
import type { WindowManagerAPI } from '../components/window/WindowManager';
import styles from './TaskBar.module.css';

/*
  开始菜单
*/
interface StartMenuProps {
  windowManager?: WindowManagerAPI | null;
}

interface StartMenuState {
  open: boolean;
}

class StartMenu extends React.PureComponent<StartMenuProps, StartMenuState> {
  state: StartMenuState = {
    open: false
  };

  handleClick = () => {
    this.setState(prev => ({ open: !prev.open }));
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleMenuClick = (action: string) => {
    const { windowManager } = this.props;
    this.handleClose();
    
    if (!windowManager) return;
    
    switch(action) {
      case 'programs':
        windowManager.openApp({ 
          id: 'explorer', 
          name: '程序', 
          type: 'explorer',
          iconName: 'folder'
        });
        break;
      case 'documents':
        windowManager.openApp({ 
          id: 'notepad', 
          name: '文档', 
          type: 'notepad',
          iconName: 'document'
        });
        break;
      case 'settings':
        windowManager.openApp({ 
          id: 'explorer', 
          name: '设置', 
          type: 'explorer',
          iconName: 'settings'
        });
        break;
      case 'help':
        windowManager.openApp({ 
          id: 'notepad', 
          name: '帮助', 
          type: 'notepad',
          iconName: 'help'
        });
        break;
      case 'shutdown':
        if (window.confirm('确定要关机吗？')) {
          alert('感谢使用 TeaTimeCode Cabin！\n\n（实际关机功能需要浏览器扩展支持）');
        }
        break;
    }
  };

  render() {
    const { open } = this.state;
    const { windowManager } = this.props;

    return (
      <div className={styles.menuWrapper}>
        <Button 
          className={`${styles.startButton} ${open ? styles.startButtonActive : ''}`}
          onClick={this.handleClick}
        >
          {getIcon('user1', { size: 'medium' })}
          开始
        </Button>
        {open && (
          <List className={styles.dropdownMenu}>
            <List.Item icon={getIcon('folder', { size: 'medium' })} onClick={() => this.handleMenuClick('programs')}>
              程序
            </List.Item>
            <List.Item icon={getIcon('document', { size: 'medium' })} onClick={() => this.handleMenuClick('documents')}>
              文档
            </List.Item>
            <List.Item icon={getIcon('notepad', { size: 'medium' })} onClick={() => this.handleMenuClick('settings')}>
              设置
            </List.Item>
            <List.Divider />
            <List.Item icon={getIcon('help', { size: 'medium' })} onClick={() => this.handleMenuClick('help')}>
              帮助
            </List.Item>
            <List.Item icon={getIcon('help', { size: 'medium' })}>
              <a href="https://react95.github.io/React95/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                React95 官方文档
              </a>
            </List.Item>
            <List.Divider />
            <List.Item icon={getIcon('drive', { size: 'medium' })} onClick={() => this.handleMenuClick('shutdown')}>
              关机
            </List.Item>
          </List>
        )}
      </div>
    );
  }
}

/*
  时钟组件
*/
interface ClockState {
  time: Date;
  isMounted: boolean;
}

class Clock extends React.PureComponent<Record<string, never>, ClockState> {
  timer: ReturnType<typeof setInterval> | null = null;

  state: ClockState = {
    time: new Date(),
    isMounted: false
  };

  componentDidMount() {
    // 标记组件已挂载，避免水合错误
    this.setState({ isMounted: true });
    
    this.timer = setInterval(() => {
      this.setState({ time: new Date() });
    }, 1000);
  }

  componentWillUnmount() {
    if (this.timer) clearInterval(this.timer);
  }

  render() {
    const { time, isMounted } = this.state;
    
    // 服务端渲染时显示占位符，避免水合错误
    if (!isMounted) {
      return (
        <div className={styles.clock}>
          --:--
        </div>
      );
    }
    
    const hours = time.getHours().toString().padStart(2, '0');
    const minutes = time.getMinutes().toString().padStart(2, '0');
    
    return (
      <div className={styles.clock}>
        {hours}:{minutes}
      </div>
    );
  }
}

/*
  任务栏
*/
interface TaskBarProps {
  windowManager: WindowManagerAPI | null;
}

interface TaskBarState {
  windows: WindowInstance[];
  activeWindowId: string | null;
}

class TaskBar extends React.PureComponent<TaskBarProps, TaskBarState> {
  updateInterval: ReturnType<typeof setInterval> | null = null;

  state: TaskBarState = {
    windows: [],
    activeWindowId: null,
  };

  componentDidMount() {
    this.updateInterval = setInterval(() => {
      const { windowManager } = this.props;
      if (windowManager) {
        const windows = windowManager.getWindows();
        const activeWindowId = windowManager.getActiveWindowId();
        this.setState({ windows, activeWindowId });
      }
    }, 100);
  }

  componentWillUnmount() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
  }

  handleWindowClick = (win: WindowInstance) => {
    const { windowManager } = this.props;
    if (windowManager) {
      if (win.isMinimized) {
        windowManager.restoreWindow(win.id);
      } else {
        windowManager.focusWindow(win.id);
      }
    }
  };

  render() {
    const { windows, activeWindowId } = this.state;
    const { windowManager } = this.props;

    return (
      <footer className={styles.taskbar}>
        <div className={styles.toolbar}>
          <div className={styles.leftSection}>
            <StartMenu windowManager={windowManager} />
            <div className={styles.windowButtonsContainer}>
              {windows.map(win => (
                <Button
                  key={win.id}
                  className={`${styles.windowButton} ${activeWindowId === win.id && !win.isMinimized ? styles.windowButtonActive : ''}`}
                  onClick={() => this.handleWindowClick(win)}
                >
                  {getIcon((win.icon || 'folder') as import('../components/icons').IconName, { size: 'small' })}
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {win.title}
                  </span>
                </Button>
              ))}
            </div>
          </div>
          <div className={styles.rightSection}>
            <div className={styles.dividerLine} />
            <Clock />
          </div>
        </div>
      </footer>
    );
  }
}

export default TaskBar;

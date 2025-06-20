import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Collapse,
  Typography,
} from '@mui/material';
import {
  Speed,
  FlightOutlined,
  ExpandLess,
  ExpandMore,
  Adjust,
} from '@mui/icons-material';

const drawerWidth = 240;

interface MenuItem {
  title: string;
  icon: React.ReactElement;
  path: string;
  hasSubmenu?: boolean;
}

interface MenuSection {
  subheader: string;
  items: MenuItem[];
}

const menuItems: MenuSection[] = [
  {
    subheader: 'OVERVIEW',
    items: [
      { title: '首页', icon: <Speed />, path: '/app' },
      { title: '活动配置', icon: <FlightOutlined />, path: '/activity' },
    ],
  },
];

interface NavItemProps {
  item: MenuItem;
  isActive: boolean;
  open: { [key: string]: boolean };
  handleClick: (item: MenuItem) => void;
}

function NavItem({
  item,
  isActive,
  open,
  handleClick,
}: NavItemProps): React.ReactElement {
  const navigate = useNavigate();

  const handleNavigate = () => {
    if (item.hasSubmenu) {
      handleClick(item);
    } else {
      navigate(item.path);
    }
  };

  const renderSubmenuIcon = () => {
    if (!item.hasSubmenu) {
      return null;
    }
    return open[item.title] ? <ExpandLess /> : <ExpandMore />;
  };

  return (
    <>
      <ListItemButton
        onClick={handleNavigate}
        sx={{
          mx: 2,
          borderRadius: 1,
          ...(isActive && {
            backgroundColor: 'rgba(0, 167, 111, 0.1)',
            color: '#00A76F',
            '&:hover': {
              backgroundColor: 'rgba(0, 167, 111, 0.2)',
            },
          }),
        }}
      >
        <ListItemIcon
          sx={{
            color: isActive ? '#00A76F' : 'inherit',
            minWidth: 'auto',
            mr: 2,
          }}
        >
          {item.icon}
        </ListItemIcon>
        <ListItemText
          primary={item.title}
          primaryTypographyProps={{
            fontWeight: isActive ? 'bold' : 'medium',
          }}
        />
        {renderSubmenuIcon()}
      </ListItemButton>
      {item.hasSubmenu && (
        <Collapse in={open[item.title]} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {/* Placeholder for submenu items */}
            <ListItemButton sx={{ pl: 4, mx: 2, borderRadius: 1 }}>
              <ListItemText primary="Sub Item 1" />
            </ListItemButton>
          </List>
        </Collapse>
      )}
    </>
  );
}

function Sidebar(): React.ReactElement {
  const [open, setOpen] = useState<{ [key: string]: boolean }>({});
  const location = useLocation();

  const handleClick = (item: MenuItem) => {
    if (item.hasSubmenu) {
      setOpen((prevOpen) => ({
        ...prevOpen,
        [item.title]: !prevOpen[item.title],
      }));
    }
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: 'border-box',
          borderRight: 'none',
          backgroundColor: '#F9FAFB',
        },
      }}
    >
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            backgroundColor: 'rgba(0, 167, 111, 0.2)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Adjust sx={{ color: '#00A76F' }} />
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Minimal
        </Typography>
      </Box>
      <List
        sx={{ width: '100%', maxWidth: 360, bgcolor: 'transparent' }}
        component="nav"
        aria-labelledby="nested-list-subheader"
      >
        {menuItems.map((list) => (
          <React.Fragment key={list.subheader}>
            <ListSubheader
              component="div"
              sx={{
                bgcolor: 'transparent',
                textTransform: 'uppercase',
                fontWeight: 'bold',
              }}
            >
              {list.subheader}
            </ListSubheader>
            {list.items.map((item) => {
              const isActive = location.pathname.startsWith(item.path);
              return (
                <NavItem
                  key={item.title}
                  item={item}
                  isActive={isActive}
                  open={open}
                  handleClick={handleClick}
                />
              );
            })}
          </React.Fragment>
        ))}
      </List>
    </Drawer>
  );
}

export default Sidebar;

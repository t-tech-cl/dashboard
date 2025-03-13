import { useEffect, useLayoutEffect, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Typography, useMediaQuery } from '@mui/material';
import { Menu } from 'menu-items/dashboard';

import { useSelector } from 'store';
import useConfig from 'hooks/useConfig';
import useAuth from 'hooks/useAuth';
import { HORIZONTAL_MAX_ITEM, MenuOrientation } from 'config';

// project import
import NavGroup from './NavGroup';
import menuItem from 'menu-items';
import { filterMenuItemsByRole } from 'utils/menu-utils';

// ==============================|| DRAWER CONTENT - NAVIGATION ||============================== //

const Navigation = () => {
  const theme = useTheme();
  const { user } = useAuth();

  const downLG = useMediaQuery(theme.breakpoints.down('lg'));

  const { menuOrientation } = useConfig();
  const { drawerOpen } = useSelector((state) => state.menu);
  const [selectedItems, setSelectedItems] = useState('');
  const [selectedLevel, setSelectedLevel] = useState(0);
  const [menuItems, setMenuItems] = useState({ items: [] });

  useEffect(() => {
    handlerMenuItem();
    // eslint-disable-next-line
  }, []);

  let getMenu = Menu();
  const handlerMenuItem = () => {
    const isFound = menuItem.items.some((element) => {
      if (element.id === 'group-dashboard') {
        return true;
      }
      return false;
    });

    if (getMenu?.id !== undefined && !isFound) {
      menuItem.items.splice(0, 0, getMenu);
      setMenuItems(menuItem);
    }
  };

  useLayoutEffect(() => {
    // Filter menu items based on user role
    if (user && user.role) {
      const filteredItems = { 
        items: menuItem.items.map(item => {
          // Process each group item
          if (item.type === 'group') {
            // Filter children based on user role
            const filteredChildren = filterMenuItemsByRole(item.children || [], user.role);
            
            // If all children are filtered out, don't render the group
            if (filteredChildren.length === 0) {
              return null;
            }
            
            return {
              ...item,
              children: filteredChildren
            };
          }
          return item;
        }).filter(Boolean) // Remove null items
      };
      
      setMenuItems(filteredItems);
    } else {
      setMenuItems(menuItem);
    }
    // eslint-disable-next-line
  }, [menuItem, user]);

  const isHorizontal = menuOrientation === MenuOrientation.HORIZONTAL && !downLG;

  const lastItem = isHorizontal ? HORIZONTAL_MAX_ITEM : null;
  let lastItemIndex = menuItems.items.length - 1;
  let remItems = [];
  let lastItemId;

  //  first it checks menu item is more than giving HORIZONTAL_MAX_ITEM after that get lastItemid by giving horizontal max
  // item and it sets horizontal menu by giving horizontal max item lastly slice menuItem from array and set into remItems

  if (lastItem && lastItem < menuItems.items.length) {
    lastItemId = menuItems.items[lastItem - 1].id;
    lastItemIndex = lastItem - 1;
    remItems = menuItems.items.slice(lastItem - 1, menuItems.items.length).map((item) => ({
      title: item.title,
      elements: item.children,
      icon: item.icon
    }));
  }

  const navGroups = menuItems.items.slice(0, lastItemIndex + 1).map((item) => {
    switch (item.type) {
      case 'group':
        return (
          <NavGroup
            key={item.id}
            setSelectedItems={setSelectedItems}
            setSelectedLevel={setSelectedLevel}
            selectedLevel={selectedLevel}
            selectedItems={selectedItems}
            lastItem={lastItem}
            remItems={remItems}
            lastItemId={lastItemId}
            item={item}
          />
        );
      default:
        return (
          <Typography key={item.id} variant="h6" color="error" align="center">
            Fix - Navigation Group
          </Typography>
        );
    }
  });
  
  return (
    <Box
      sx={{
        pt: drawerOpen ? (isHorizontal ? 0 : 2) : 0,
        '& > ul:first-of-type': { mt: 0 },
        display: isHorizontal ? { xs: 'block', lg: 'flex' } : 'block'
      }}
    >
      {navGroups}
    </Box>
  );
};

export default Navigation;

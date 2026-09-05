import { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  AppBar,
  IconButton,
  Typography,
  Stack,
  Tooltip,
  useMediaQuery,
  useTheme,
  Divider,
} from '@mui/material';
import {
  DashboardOutlined,
  DescriptionOutlined,
  InsightsOutlined,
  CompareArrowsOutlined,
  TravelExploreOutlined,
  MenuRounded,
  DarkModeOutlined,
  LightModeOutlined,
  AutoAwesome,
} from '@mui/icons-material';
import { useThemeMode } from '@/theme/ThemeModeContext';

const DRAWER_WIDTH = 248;

const NAV_ITEMS = [
  { label: 'Dashboard', path: '/', icon: <DashboardOutlined /> },
  { label: 'Resume Builder', path: '/builder', icon: <DescriptionOutlined /> },
  { label: 'Resume Analyzer', path: '/analyzer', icon: <InsightsOutlined /> },
  { label: 'Compare Resumes', path: '/compare', icon: <CompareArrowsOutlined /> },
  { label: 'Job Description Matcher', path: '/job-match', icon: <TravelExploreOutlined /> },
];

export function MainLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const { mode, toggleMode } = useThemeMode();

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Toolbar sx={{ px: 3, py: 2.5 }}>
        <Stack direction="row" spacing={1.25} alignItems="center">
          <Box
            sx={{
              width: 34,
              height: 34,
              borderRadius: 2,
              background: 'linear-gradient(135deg, #3B5BFD, #14B8A6)',
              display: 'grid',
              placeItems: 'center',
            }}
          >
            <AutoAwesome sx={{ fontSize: 18, color: '#fff' }} />
          </Box>
          <Typography variant="h6" fontWeight={800} sx={{ fontFamily: '"Sora", sans-serif' }}>
            ResumeInsight
          </Typography>
        </Stack>
      </Toolbar>
      <List sx={{ px: 2, flexGrow: 1 }}>
        {NAV_ITEMS.map((item) => {
          const selected =
            item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path);
          return (
            <ListItemButton
              key={item.path}
              selected={selected}
              onClick={() => {
                navigate(item.path);
                setMobileOpen(false);
              }}
              sx={{
                borderRadius: 2.5,
                mb: 0.5,
                '&.Mui-selected': {
                  bgcolor: 'primary.main',
                  color: '#fff',
                  '& .MuiListItemIcon-root': { color: '#fff' },
                  '&:hover': { bgcolor: 'primary.dark' },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 38 }}>{item.icon}</ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{ fontWeight: 600, fontSize: 14 }}
              />
            </ListItemButton>
          );
        })}
      </List>
      <Divider sx={{ mx: 2, mb: 2 }} />
      <Box sx={{ px: 3, pb: 3 }}>
        <Typography variant="caption" color="text.secondary">
          ResumeInsight AI v1.0
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar
        position="fixed"
        color="transparent"
        elevation={0}
        sx={{
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { md: `${DRAWER_WIDTH}px` },
          bgcolor: 'background.default',
          borderBottom: '1px solid',
          borderColor: 'divider',
          backdropFilter: 'blur(8px)',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          {!isDesktop && (
            <IconButton onClick={() => setMobileOpen(true)} aria-label="Open navigation menu">
              <MenuRounded />
            </IconButton>
          )}
          <Box sx={{ flexGrow: 1 }} />
          <Tooltip title={mode === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}>
            <IconButton onClick={toggleMode} aria-label="Toggle color mode">
              {mode === 'light' ? <DarkModeOutlined /> : <LightModeOutlined />}
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' },
          }}
        >
          {drawerContent}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH,
              boxSizing: 'border-box',
              borderRight: '1px solid',
              borderColor: 'divider',
            },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          minHeight: '100vh',
          bgcolor: 'background.default',
        }}
      >
        <Toolbar />
        <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}

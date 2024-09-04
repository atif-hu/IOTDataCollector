import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack'; 
import { useState, useEffect  } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '@mui/material/Modal';
import { Box, Button } from '@mui/material';
import TextField from '@mui/material/TextField';

// material-ui
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { InputAdornment } from '@mui/material';
import IconButton from '@mui/material/IconButton';
// assets
import EditOutlined from '@ant-design/icons/EditOutlined';
import LogoutOutlined from '@ant-design/icons/LogoutOutlined';
import Iconify from 'src/components/iconify';
//project
import config from 'config';


// ==============================|| HEADER PROFILE - PROFILE TAB ||============================== //

export default function ProfileTab() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [userData, setUserData] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const router = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const userId = document.cookie.split('; ').find(row => row.startsWith('user_id')).split('=')[1];

  const handleListItemClick = (index) => {
    setSelectedIndex(index);
    if (index === 0) {
      setOpenModal(true);
    }
  };
  const [showPassword, setShowPassword] = useState(false);
  
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`${config.BACKEND_LOCALHOST}/api/User/${userId}`); 
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }
    fetchData();
  }, []);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSaveProfile = async () => {
    try {
      const userId = document.cookie.split('; ').find(row => row.startsWith('user_id')).split('=')[1];
      
      const response = await fetch(`${config.BACKEND_LOCALHOST}/api/User/${userId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        });
        if (!response.ok) {
          const data = await response.json();
          enqueueSnackbar("Prodile Update failed", { variant: 'error' });
          throw new Error(data.message);
        }
  
        enqueueSnackbar('Profile Updated', { variant: 'success' });
    } 
    catch (error) {
      console.error('Error updating user profile:', error);
    }
  };

  const handleLogout = () =>{
    document.cookie = `access_token=; expires=Thu, 01 Jan 2000 00:00:00 UTC; path=/;`;
    document.cookie = `user_id=; expires=Thu, 01 Jan 2000 00:00:00 UTC; path=/;`;
    router('/login')
  }

  return (
    <>
    <List component="nav" sx={{ p: 0, '& .MuiListItemIcon-root': { minWidth: 32 } }}>
      <ListItemButton selected={selectedIndex === 0} onClick={() => handleListItemClick(0)}>
        <ListItemIcon>
          <EditOutlined />
        </ListItemIcon>
        <ListItemText primary="Edit Profile" />
      </ListItemButton>
      
      <ListItemButton selected={selectedIndex === 1} onClick={handleLogout}>
        <ListItemIcon>
          <LogoutOutlined />
        </ListItemIcon>
        <ListItemText primary="Logout" />
      </ListItemButton>
    </List>

    <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        aria-labelledby="edit-profile-modal"
        aria-describedby="edit-profile-modal-description"
      >
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4, borderRadius: 6 }}>
          <h2 id="edit-profile-modal">Edit Profile</h2>
          <form onSubmit={handleSaveProfile}>
            <TextField
              label="Email"
              defaultValue={userData?userData.email:''}
              onChange={(e) => setUserData({ ...userData, email: e.target.value })}
              fullWidth
              margin="normal"
            />
              <TextField
                label="Password"
                defaultValue={userData?.password}
                onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                fullWidth
                margin="normal"
                type={showPassword ? 'text' : 'password'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                    </IconButton>
                  </InputAdornment>
                  ),
                }}
              />
            <TextField
              label="First Name"
              defaultValue={userData?.firstName}
              onChange={(e) => setUserData({ ...userData, firstName: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Last Name"
              defaultValue={userData?.lastName}
              onChange={(e) => setUserData({ ...userData, lastName: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Phone Number"
              defaultValue={userData?.phoneNumber}
              onChange={(e) => setUserData({ ...userData, phoneNumber: e.target.value })}
              fullWidth
              margin="normal"
            />
           <Box  display="flex" justifyContent="flex-end">
            <Button type="reset" onClick={() => setOpenModal(false)} variant="contained" color="error" sx={{mr : '4px', mt:'4px'}}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary" sx={{mt:'4px'}}>
              Save
            </Button>
            </Box>
          </form>
        </Box>
      </Modal>

    </>
  );
}

ProfileTab.propTypes = { handleLogout: PropTypes.func };

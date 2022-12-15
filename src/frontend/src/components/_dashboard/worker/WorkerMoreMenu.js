import { Icon } from '@iconify/react';
import { useRef, useState } from 'react';
import editFill from '@iconify/icons-eva/edit-fill';
import { Link as RouterLink } from 'react-router-dom';
import trash2Outline from '@iconify/icons-eva/trash-2-outline';
import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill';
import toggleOff from '@iconify/icons-bi/toggle-off';
import toggleOn from '@iconify/icons-bi/toggle-on';
// material
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText } from '@material-ui/core';
import { useConfirm } from 'material-ui-confirm';
import {api} from '../../../services';
import { withSnackbar } from '../../../hooks/withSnackbar';


// ----------------------------------------------------------------------

const WorkerMoreMenu = (props) => {
  const {row, getData} = props
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const confirm = useConfirm()

  const remove = async (event) =>{
    confirm({ description: 'Confirm removal of this item?' })
      .then(() => {
        api.remove(`worker/${row.id}`).then(res=>{
          if (res){
            getData()
            props.props.showMessageWarning("The worker was removed!")
          } else {
            props.showMessageError(`Failed to remove this worker. There are dependencies.`)
          }
        })
      })
      .catch(() => { /* ... */ });
  }

  const updateActive = async (event) =>{
      row.active = Math.abs(row.active-1)
      api.put(`worker/${row.id}`,row).then(res=>{
        if (res){
          getData()
        } else {
          props.showMessageError(`Failed to update this worker.`)
        }
      })
  }

  return (
    <>
      <IconButton ref={ref} onClick={() => setIsOpen(true)}>
        <Icon icon={moreVerticalFill} width={20} height={20} />
      </IconButton>

      <Menu
        open={isOpen}
        anchorEl={ref.current}
        onClose={() => setIsOpen(false)}
        PaperProps={{
          sx: { width: 200, maxWidth: '100%' }
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem sx={{ color: 'text.primary' }} onClick={(event)=>{remove(event)}}>
          <ListItemIcon>
            <Icon icon={trash2Outline} width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Delete" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>

        {parseInt(row.active, 10) === 0 && (
            <MenuItem onClick={(event)=>{updateActive(event)}} sx={{ color: 'text.primary' }}>
              <ListItemIcon>
                <Icon icon={toggleOff} width={24} height={24} />
              </ListItemIcon>
              <ListItemText primary="Activate" primaryTypographyProps={{ variant: 'body2' }} />
            </MenuItem>
        )}

        {parseInt(row.active, 10) === 1 && (
            <MenuItem onClick={(event)=>{updateActive(event)}} sx={{ color: 'text.primary' }}>
              <ListItemIcon>
                <Icon icon={toggleOn} width={24} height={24} />
              </ListItemIcon>
              <ListItemText primary="Inactivate" primaryTypographyProps={{ variant: 'body2' }} />
            </MenuItem>
        )}

        
      </Menu>
    </>
  );
}

export default withSnackbar(WorkerMoreMenu)

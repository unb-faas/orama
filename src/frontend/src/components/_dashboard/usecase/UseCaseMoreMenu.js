import { Icon } from '@iconify/react';
import { useRef, useState } from 'react';
import editFill from '@iconify/icons-eva/edit-fill';
import { Link as RouterLink } from 'react-router-dom';
import trash2Outline from '@iconify/icons-eva/trash-2-outline';
import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill';
import cloudComputer from '@iconify/icons-grommet-icons/cloud-computer';
import documentHeaderRemove24Regular from '@iconify/icons-fluent/document-header-remove-24-regular';

// material
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText } from '@material-ui/core';
import {api} from '../../../services';
import { withSnackbar } from '../../../hooks/withSnackbar';

// ----------------------------------------------------------------------

const UseCaseMoreMenu = (props) => {
  const { row, status, getData} = props
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleProvision = () =>{
    api.get(`provision/${row.id}/${row.acronym}`,'orchestrator')
      .catch(error=>{
          props.showMessageError(`Provision error: ${error}`)
        })
      .then(res=>{
        if (res){
          let count = 0
          const limit = 360 // 30 minutes
          props.showMessageSuccess("Provision requested")
          const interval = setInterval(()=>{
            getData()
            count += 1
          }, 5000)
          if (count === limit) {
            clearInterval(interval);
          }
        } else {
          props.showMessageError(`Provision failed: ${res}`)
        }
      })
  }

  const handleUnprovision = () =>{
    api.get(`unprovision/${row.id}/${row.acronym}`,'orchestrator').then(res=>{
      if(res){
        let count = 0
          const limit = 360 // 30 minutes
          props.showMessageSuccess("Unprovision requested")
          const interval = setInterval(()=>{
            getData()
            count += 1
          }, 5000)
          if (count === limit) {
            clearInterval(interval);
          }
        } else {
          props.showMessageError(`Unrovision failed: ${res}`)
        }
    })
  }

  const remove = async (event) =>{
    api.remove(`usecase/${row.id}`).then(res=>{
      if (res){
        props.props.showMessageWarning("The Use Case was removed!")
        getData()
      } else {
        props.props.showMessageError(`Failed to remove this use case. There are dependencies.`)
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

        {(!status || (status && status.status!==2)) && (
          <MenuItem sx={{ color: 'text.primary' }} onClick={(event) => handleProvision(event)}>
            <ListItemIcon>
              <Icon icon={cloudComputer} width={24} height={24} />
            </ListItemIcon>
            <ListItemText primary="Provision" primaryTypographyProps={{ variant: 'body2' }} />
          </MenuItem>
        )}

        {(status && (status.status===1 || status.status===2 || status.status===5 || status.status===6)) && (
          <MenuItem sx={{ color: 'text.primary' }} onClick={(event) => handleUnprovision(event)} >
            <ListItemIcon>
              <Icon icon={documentHeaderRemove24Regular} width={24} height={24} />
            </ListItemIcon>
            <ListItemText primary="Unprovision" primaryTypographyProps={{ variant: 'body2' }} />
          </MenuItem>
        )}

        <MenuItem sx={{ color: 'text.primary' }} onClick={(event)=>{remove(event)}}>
          <ListItemIcon>
            <Icon icon={trash2Outline} width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Delete" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>

        <MenuItem component={RouterLink} to={`${row.id}`} sx={{ color: 'text.primary' }}>
          <ListItemIcon>
            <Icon icon={editFill} width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Edit" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
      </Menu>
    </>
  );
}

export default withSnackbar(UseCaseMoreMenu)


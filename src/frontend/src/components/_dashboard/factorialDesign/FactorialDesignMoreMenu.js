import { Icon } from '@iconify/react';
import { useRef, useState } from 'react';
import editFill from '@iconify/icons-eva/edit-fill';
import { Link as RouterLink } from 'react-router-dom';
import trash2Outline from '@iconify/icons-eva/trash-2-outline';
import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill';
import graphIcon from '@iconify/icons-flat-ui/graph';

// material
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText } from '@material-ui/core';
import { useConfirm } from 'material-ui-confirm';
import {api} from '../../../services';
import { withSnackbar } from '../../../hooks/withSnackbar';

// ----------------------------------------------------------------------

const FactorialDesignMoreMenu = (props) => {
  const { row, status, getData, countBenchmarks} = props
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const confirm = useConfirm()

  const remove = async (event) =>{
    confirm({ description: 'Confirm removal of this item?' })
      .then(() => {
        api.remove(`factorialDesign/${row.id}`).then(res=>{
          if (res){
            getData()
            props.props.showMessageWarning("The Factorial Design was removed!")
          } else {
            props.showMessageError(`Failed to remove this Factorial Design. There are dependencies.`)
          }
        })
      })
      .catch(() => { /* ... */ });
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
        {(row.benchmarks.list && Object.keys(row.benchmarks.list).length && (
          <MenuItem component={RouterLink} to={`${row.id}/analysis`} sx={{ color: 'text.primary' }} >
            <ListItemIcon>
              <Icon icon={graphIcon} width={24} height={24} />
            </ListItemIcon>
            <ListItemText primary="Analysis" primaryTypographyProps={{ variant: 'body2' }} />
          </MenuItem>
        ))}

        <MenuItem sx={{ color: 'text.error' }} onClick={(event)=>{remove(event)}}>
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

export default withSnackbar(FactorialDesignMoreMenu)
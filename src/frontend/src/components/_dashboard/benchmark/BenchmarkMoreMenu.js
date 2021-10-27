import { Icon } from '@iconify/react';
import { useRef, useState } from 'react';
import editFill from '@iconify/icons-eva/edit-fill';
import { Link as RouterLink } from 'react-router-dom';
import trash2Outline from '@iconify/icons-eva/trash-2-outline';
import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill';
import playCircleFilled from '@iconify/icons-ant-design/play-circle-filled';
import tableOutlined from '@iconify/icons-ant-design/table-outlined';
import stopCircleFill from '@iconify/icons-bi/stop-circle-fill';
// material
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText } from '@material-ui/core';
import { useConfirm } from 'material-ui-confirm';
import {api} from '../../../services';
import { withSnackbar } from '../../../hooks/withSnackbar';

// ----------------------------------------------------------------------

const BenchmarkMoreMenu = (props) => {
  const { row, usecases, id_usecase, usecase_acronym, id_benchmark, concurrences, repetitions, getData, playBenchmark, stopBenchmark} = props
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const confirm = useConfirm()

  const remove = async (event) =>{
    confirm({ description: 'Confirm removal of this item?' })
      .then(() => {
        api.remove(`benchmark/${id_benchmark}`).then(res=>{
          if (res){
            props.props.showMessageWarning("The benchmark was removed!")
          } else {
            props.props.showMessageError("Failed to remove this benchmark! - Firstly remove related executions")
          }
        }).catch(e=>{
          props.showMessageError(`Request failed ${e}`)
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

        {(parseInt(row.execution_running,10) === 0 && usecases && usecases[row.id_usecase] && usecases[row.id_usecase].urls && Object.keys(usecases[row.id_usecase].urls).length > 0 && row.activation_url) && (
          <MenuItem sx={{ color: 'text.primary' }} onClick={(event)=>{playBenchmark(row.id)}}>
            <ListItemIcon >
              <Icon icon={playCircleFilled} width={24} height={24} />
            </ListItemIcon>
            <ListItemText primary="Play" primaryTypographyProps={{ variant: 'body2' }} />
          </MenuItem>
        )}

        {(parseInt(row.execution_running,10) !== 0 && usecases && usecases[row.id_usecase] && usecases[row.id_usecase].urls && Object.keys(usecases[row.id_usecase].urls).length > 0 && row.activation_url) && (
          <MenuItem sx={{ color: 'text.primary' }} onClick={(event)=>{stopBenchmark(row.id)}}>
            <ListItemIcon >
              <Icon icon={stopCircleFill} width={24} height={24} />
            </ListItemIcon>
            <ListItemText primary="Stop" primaryTypographyProps={{ variant: 'body2' }} />
          </MenuItem>
        )}

        <MenuItem component={RouterLink} to={`executions/${id_benchmark}`} sx={{ color: 'text.primary' }}>
          <ListItemIcon>
            <Icon icon={tableOutlined} width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Executions" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>

        <MenuItem sx={{ color: 'text.primary' }} onClick={(event)=>{remove(event)}}>
          <ListItemIcon>
            <Icon icon={trash2Outline} width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Delete" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>

        <MenuItem component={RouterLink} to={`${id_benchmark}`}  sx={{ color: 'text.primary' }}>
          <ListItemIcon>
            <Icon icon={editFill} width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Edit" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
      </Menu>
    </>
  );
}

export default withSnackbar(BenchmarkMoreMenu)
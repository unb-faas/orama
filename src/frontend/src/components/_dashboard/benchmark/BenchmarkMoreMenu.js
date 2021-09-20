import { Icon } from '@iconify/react';
import { useRef, useState } from 'react';
import editFill from '@iconify/icons-eva/edit-fill';
import { Link as RouterLink } from 'react-router-dom';
import trash2Outline from '@iconify/icons-eva/trash-2-outline';
import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill';
import playCircleFilled from '@iconify/icons-ant-design/play-circle-filled';
import tableOutlined from '@iconify/icons-ant-design/table-outlined';
// material
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText } from '@material-ui/core';
import {api} from '../../../services';
import { withSnackbar } from '../../../hooks/withSnackbar';

// ----------------------------------------------------------------------

const BenchmarkMoreMenu = (props) => {
  const { id_usecase, usecase_acronym, id_benchmark, concurrences, repetitions } = props
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const playBenchmark = async (event) =>{
    const usecase_status = await api.get(`status/${id_usecase}/${usecase_acronym}`,"orchestrator")
    if (true || usecase_status && usecase_status.status === 2){
      api.get(`benchmark/${id_benchmark}/play`).then(res=>{
        props.showMessageSuccess("The benchmark execution was requested!")
      })

      //  const newBenchmarkExecution = {
      //    "id_benchmark":id_benchmark
      //  }
      //  const executionCreation = await api.post(`benchmarkExecution`,newBenchmarkExecution)
      //  props.showMessageSuccess(`New execution created: #${executionCreation.data}`)
      //  const usecase_urls = await api.get(`urls/${id_usecase}/${usecase_acronym}`,"orchestrator")
      //  Object.keys(usecase_urls.data).forEach((provider) => {
      //    const url_full = usecase_urls.data[provider].get
      //    const url = url_full.split("//")[1].split('/')[0]
      //    const url_path = url_full.split("//")[1].split('/')[1]
      //    for (let counter=1; counter <= repetitions; counter+=1) {
      //    concurrences.forEach(concurrence=>{
      //        api.get(`run/${executionCreation.data}/${provider}/${url}/${url_path}/${concurrence}/${counter}/0`,"benchmarker").then(res=>{
      //            props.showMessageSuccess(`Benchmark started on ${provider} with ${concurrence} paralell requests - R${counter}`)
      //          })
      //      })
      //    }
      //  });
      //  props.showMessageSuccess("The use case is ready!")
    } else {
      props.showMessageError("The use case is not ready! It should be provisioned.")
    }
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
        <MenuItem sx={{ color: 'text.secondary' }} onClick={(event)=>{playBenchmark(event)}}>
          <ListItemIcon >
            <Icon icon={playCircleFilled} width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Play" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>

        <MenuItem component={RouterLink} to={`executions/${id_benchmark}`} sx={{ color: 'text.secondary' }}>
          <ListItemIcon>
            <Icon icon={tableOutlined} width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Executions" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>

        <MenuItem sx={{ color: 'text.disabled' }}>
          <ListItemIcon>
            <Icon icon={trash2Outline} width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Delete" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>

        <MenuItem component={RouterLink} to="#" sx={{ color: 'text.disabled' }}>
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
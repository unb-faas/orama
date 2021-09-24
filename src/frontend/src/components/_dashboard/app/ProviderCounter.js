import { Icon } from '@iconify/react';
import cloudFilled from '@iconify/icons-ant-design/cloud-filled';
// material
import { alpha, styled } from '@material-ui/core/styles';
import { Card, Typography } from '@material-ui/core';
import { useState, useEffect } from 'react';

// utils
import { fShortenNumber } from '../../../utils/formatNumber';
import { api } from '../../../services';


// ----------------------------------------------------------------------

const RootStyle = styled(Card)(({ theme }) => ({
  boxShadow: 'none',
  textAlign: 'center',
  padding: theme.spacing(5, 0),
  color: theme.palette.info.darker,
  backgroundColor: theme.palette.info.lighter
}));

const IconWrapperStyle = styled('div')(({ theme }) => ({
  margin: 'auto',
  display: 'flex',
  borderRadius: '50%',
  alignItems: 'center',
  width: theme.spacing(8),
  height: theme.spacing(8),
  justifyContent: 'center',
  marginBottom: theme.spacing(3),
  color: theme.palette.info.dark,
  backgroundImage: `linear-gradient(135deg, ${alpha(theme.palette.info.dark, 0)} 0%, ${alpha(
    theme.palette.info.dark,
    0.24
  )} 100%)`
}));

// ----------------------------------------------------------------------


export default function AppNewUsers() {
  const [control, setControl] = useState(0);
  const [total, setTotal] = useState(0);

  const getData = () =>{
    const params = {page:0,size:1}
    api.list('provider','backend',params).then(res=>{
      setTotal(res.data.total)
    })
  }

  useEffect(() => {
    getData()
  },[control]); 

  return (
    <RootStyle>
      <IconWrapperStyle>
        <Icon icon={cloudFilled} width={24} height={24} />
      </IconWrapperStyle>
      <Typography variant="h3">{fShortenNumber(total)}</Typography>
      <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
        Providers
      </Typography>
    </RootStyle>
  );
}

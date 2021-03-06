import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import searchFill from '@iconify/icons-eva/search-fill';
import playCircleFilled from '@iconify/icons-ant-design/play-circle-filled';
import roundFilterList from '@iconify/icons-ic/round-filter-list';
import sharpCompare from '@iconify/icons-ic/sharp-compare';
import { useNavigate } from 'react-router-dom';

// material
import { styled } from '@material-ui/core/styles';
import {
  Box,
  Toolbar,
  Tooltip,
  IconButton,
  Typography,
  OutlinedInput,
  InputAdornment
} from '@material-ui/core';
import React from 'react';

// ----------------------------------------------------------------------

const RootStyle = styled(Toolbar)(({ theme }) => ({
  height: 96,
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1, 0, 3)
}));

const SearchStyle = styled(OutlinedInput)(({ theme }) => ({
  width: 240,
  transition: theme.transitions.create(['box-shadow', 'width'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter
  }),
  '&.Mui-focused': { width: 320, boxShadow: theme.customShadows.z8 },
  '& fieldset': {
    borderWidth: `1px !important`,
    borderColor: `${theme.palette.grey[500_32]} !important`
  }
}));

// ----------------------------------------------------------------------

BenchmarkListToolbar.propTypes = {
  numSelected: PropTypes.number,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func
};

export default function BenchmarkListToolbar(props) {
  const { numSelected, filterName, onFilterName, selected, setSelected, playBenchmark } = props
  const navigate = useNavigate();

  const handlePlaySelected = () =>{
    selected.forEach(element=>{
      playBenchmark(element)
    })
  }

  const handleCompare = () => {
    navigate(`/dashboard/benchmarks/compare/${selected.join(',')}`);
  }

  return (
    <RootStyle
      sx={{
        ...(numSelected > 0 && {
          color: 'primary.main',
          bgcolor: 'primary.lighter'
        })
      }}
    >
      {numSelected > 0 ? (
        <Typography component="div" variant="subtitle1">
          {numSelected} selected
        </Typography>
      ) : (
        <Box>
          <SearchStyle
            value={filterName}
            onChange={onFilterName}
            placeholder="Search benchmark..."
            startAdornment={
              <InputAdornment position="start">
                <Box component={Icon} icon={searchFill} sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            }
          /> 
        </Box>
      )}

      {numSelected > 0 && (
        <>
          <Tooltip title="Play">
            <IconButton onClick={handlePlaySelected}>
              <Icon icon={playCircleFilled} />
            </IconButton>
          </Tooltip>

          <Tooltip title="Compare last executions">
            <IconButton onClick={handleCompare}>
              <Icon icon={sharpCompare} />
            </IconButton>
          </Tooltip>
        </>
      )}
    </RootStyle>
  );
}

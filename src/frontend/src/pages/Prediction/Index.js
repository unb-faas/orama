import { filter } from 'lodash';
import { Icon } from '@iconify/react';
import { useState, useEffect } from 'react';
import plusFill from '@iconify/icons-eva/plus-fill';
import checkCircleFilled from '@iconify/icons-ant-design/check-circle-filled';
import outlineCancel from '@iconify/icons-ic/outline-cancel';
import alertTriangleOutline from '@iconify/icons-eva/alert-triangle-outline';
import { Link as RouterLink } from 'react-router-dom';
// material
import {
  Card,
  CardContent,
  TextField,
  Table,
  Stack,
  Box,
  Grid,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  CircularProgress,
  Select,
  MenuItem,
  IconButton
} from '@material-ui/core';
import AceEditor from "react-ace";

// Importação dos modos e temas necessários
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-monokai";

// components
import Page from '../../components/Page';
import Scrollbar from '../../components/Scrollbar';
import SearchNotFound from '../../components/SearchNotFound';
import { FactorialDesignListHead, FactorialDesignListToolbar, FactorialDesignMoreMenu } from '../../components/_dashboard/factorialDesign';
import {api} from '../../services';
import { withSnackbar } from '../../hooks/withSnackbar';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'id', label: 'Id', alignRight: false },
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'date', label: 'Date', alignRight: false },
  { id: 'benchmarks', label: 'Benchmarks', alignRight: false, sortable: false },
  { id: '' }
];

const moment = require('moment');  

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

const CodePrediction = (props) => {
  const initialPredictions = {
    "lambda":0,
    "gcf":0,
    "azf":0,
    "afc":0,
  }
  const [control, setControl] = useState(true);
  const [code, setCode] = useState("// type your code here");
  const [concurrency, setConcurrency] = useState(1);
  const [input_level, setInputLevel] = useState("low");
  const [predictions, setPredictions] = useState(initialPredictions);
  const [invocationsNumber, setInvocationsNumber] = useState(0);
  const [cpuUsage, setCpuUsage] = useState(0);
  const [memory, setMemory] = useState(0)
  const [providers, setProviders] = useState([]);
  const [providersReqErrorMessage, setprovidersReqErrorMessage] = useState(null)
  const [selectedRegions, setSelectedRegions] = useState([]);

  const predict = async () => {
    if (!code.trim()){
      setPredictions(initialPredictions)
      return;

    }
    const res = await api.post("analyze", { code }, "halsteader")
    if (!res) {
      setPredictions(initialPredictions)
      return;
    }

    const analyzedData = res.data;

    const promises = Object.keys(predictions).map(async (provider) => {
      const payload = {
        success: 1,
        concurrency,
        provider,
        input_level,
        total_operands: analyzedData.total_operands,
        distinct_operands: analyzedData.distinct_operands,
        total_operators: analyzedData.total_operators,
        distinct_operators: analyzedData.distinct_operators,
        time: analyzedData.time,
        bugs: analyzedData.bugs,
        effort: analyzedData.effort,
        volume: analyzedData.volume,
        difficulty: analyzedData.difficulty,
        vocabulary: analyzedData.vocabulary,
        length: analyzedData.length,
      };

      try {
        const predictedData = await api.post("predict_duration", payload, "predictor");
        return [provider, predictedData.data.predicted_duration];
      } catch (error) {
        return [provider, 0]; // fallback em caso de erro
      }
    });

    const results = await Promise.all(promises);

    const newPredictions = {};
    results.forEach(([provider, duration]) => {
      newPredictions[provider] = duration;
    });

    setPredictions(prev => ({ ...prev, ...newPredictions }));
  };

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    setControl(!control);
  };

  const handleConcurrencyChange = (event) => {
    setConcurrency(event.target.value);
    setControl(!control);
  };

  const handleInputLevelChange = (event) => {
    setInputLevel(event.target.value);
    setControl(!control);
  };

  useEffect(async() => {
    await predict()
  },[control]); 

  useEffect(() => {
  },[predictions]);

  const getDefaultProvidersList = () => {
    api.list('provider', 'backend', { size: 4 }).then((res) => {
      if (!res) return setprovidersReqErrorMessage('Não foi possível obter os providers');

      if (!res.data.count)
        return setprovidersReqErrorMessage(
          'Não foi possível obter os providers. Verifique se a seed foi executada'
        );

      if (!res.data.data[0].costs)
        return setprovidersReqErrorMessage(
          'Não foi possível obter os custos dos providers. Verifique se a seed foi executada'
        );

      setProviders(res.data.data);
    });
  };

  useEffect(() => {
    getDefaultProvidersList();
  }, [])

  let providersRequestStatus;
  if (providersReqErrorMessage) providersRequestStatus = 'error'; 
  else if (!providers.length) providersRequestStatus = 'loading';
  else providersRequestStatus = 'success';

  const handleInvocationChange = (event) => {
    setInvocationsNumber(event.target.value)
  }

  const handleCpuChange = (event) => {
    setCpuUsage(event.target.value)
  }

  const handleMemoryChange = (event) => {
    setMemory(event.target.value)
  }

  const computePrice = (providerRegion) => {
    const mapProviderAcronymToPredictionKey = {
      AWS: 'lambda',
      GCP: 'gcf',
      Azure: 'azf',
      Alibaba: 'afc'
    };

    const time = predictions[mapProviderAcronymToPredictionKey[providerRegion.acronym]]
    const hitCost = invocationsNumber * providerRegion.costs.hit;
    const memoryCost = invocationsNumber * providerRegion.costs.gb_s * (memory / 1024) * time / 1000;
    const cpuCost = invocationsNumber * (time / 1000) * providerRegion.costs.vcpu_s * cpuUsage

    return hitCost + memoryCost + cpuCost
  }

  const handleAddClick = () => {
    const firstProvider = providers[0];
    const [region, costs] = Object.entries(firstProvider.costs)[0]
    const newSelectedRegions = selectedRegions.concat({
      id: Math.random(),
      acronym: providers[0].acronym,
      region,
      costs
    })
    setSelectedRegions(newSelectedRegions)
  }

  const handleAcronymChange = (id, event) => {
    const selectedRegionsClone = [...selectedRegions]

    const newAcronym = event.target.value
    const newProvider = providers.find(provider => provider.acronym === newAcronym)
    const providerRegion = selectedRegionsClone.find(providerRegion => providerRegion.id === id) 
    const [newRegion, newCosts] = Object.entries(newProvider.costs)[0]

    providerRegion.acronym = newProvider.acronym
    providerRegion.region = newRegion
    providerRegion.costs = newCosts

    setSelectedRegions(selectedRegionsClone)
  }

  const handleRegionChange = (id, event) => {
    const selectedRegionsClone = [...selectedRegions];
    const newRegion = event.target.value;

    const currentAcronym = selectedRegionsClone.find(providerRegion => providerRegion.id === id).acronym;
    const provider = providers.find(provider => provider.acronym === currentAcronym);
    const newCosts = provider.costs[newRegion];

    const providerRegion = selectedRegionsClone.find(providerRegion => providerRegion.id === id);
    providerRegion.region = newRegion;
    providerRegion.costs = newCosts;

    setSelectedRegions(selectedRegionsClone)
  }

  const handleDeleteClick = (id) => {
    const selectedRegionsClone = [...selectedRegions];
    const index = selectedRegionsClone.findIndex(providerRegion => providerRegion.id === id);
    selectedRegionsClone.splice(index, 1);
    setSelectedRegions(selectedRegionsClone);
  }

  return (
    <Page title="Code Prediction | Orama Framework">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Code Prediction
          </Typography>
        </Stack>
        
        <AceEditor
          mode="javascript"
          theme="monokai"
          value={code}
          onChange={handleCodeChange}
          name="code-editor"
          editorProps={{ $blockScrolling: true }}
          width="100%"
          height="500px"
        />

        <Box mt={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">
                Execution time (ms)
              </Typography>
              <Box>
                <Box display="flex" mb={2} mt={2} gap={2}>
                  <TextField
                    InputLabelProps={{ shrink: true }}
                    autoComplete="concurrency"
                    type="string"
                    label="Concurrency"
                    value={concurrency}
                    onChange={handleConcurrencyChange}
                  />
                  <Box display="flex" gap={2}>
                  <TextField
                      InputLabelProps={{ shrink: true }} 
                      select
                      autoComplete="input_level"
                      type="string"
                      label="Input Level"
                      fullWidth
                      value={input_level}
                      onChange={handleInputLevelChange}
                    >
                        <MenuItem value="none" key="none">None</MenuItem>      
                        <MenuItem value="low" key="low">Low</MenuItem>      
                        <MenuItem value="medium" key="medium">Medium</MenuItem>      
                        <MenuItem value="high" key="high">High</MenuItem>      
                    </TextField>
                    <TextField
                      InputLabelProps={{ shrink: true }}
                      autoComplete="lambda"
                      type="string"
                      label="Lambda"
                      disabled
                      fullWidth
                      value={predictions.lambda}
                    />
                    <TextField
                      InputLabelProps={{ shrink: true }}
                      autoComplete="lambda"
                      type="string"
                      label="Azure Functions"
                      disabled
                      fullWidth
                      value={predictions.azf}
                    />
                    <TextField
                      InputLabelProps={{ shrink: true }}
                      autoComplete="lambda"
                      type="string"
                      label="Google Cloud Functions"
                      disabled
                      fullWidth
                      value={predictions.gcf}
                    />
                    <TextField
                      InputLabelProps={{ shrink: true }}
                      autoComplete="lambda"
                      type="string"
                      label="Alibaba Functions"
                      disabled
                      fullWidth
                      value={predictions.afc}
                    />
                  </Box>
                </Box>
              </Box> 
            </CardContent>  
          </Card>
        </Box>
        <Box mt={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Costs Estimatives (US$)</Typography>
              {providersRequestStatus === 'loading' && (
                <Box display='flex' justifyContent='center'>
                  <CircularProgress />
                </Box>
              )}
              {providersRequestStatus === 'error' && (
                <>
                  <Typography>Ocorreu um erro ao obter dados dos providers</Typography>
                  <Typography>{providersReqErrorMessage}</Typography>
                </>
              )}
              {providersRequestStatus === 'success' && (
                <>
                  <Box>
                    <Box display="flex" justifyContent="space-between" mb={2} mt={2}>
                      <Box display="flex" gap={2}>
                        <TextField
                          InputLabelProps={{ shrink: true }}
                          autoComplete="invocations"
                          type="string"
                          label="Invocations"
                          value={invocationsNumber}
                          onChange={handleInvocationChange}
                        />
                        <TextField
                          InputLabelProps={{ shrink: true }}
                          autoComplete="cpu"
                          type="string"
                          label="CPU"
                          value={cpuUsage}
                          onChange={handleCpuChange}
                        />
                        <TextField
                          InputLabelProps={{ shrink: true }}
                          autoComplete="memory"
                          type="string"
                          label="Memory (MB)"
                          value={memory}
                          onChange={handleMemoryChange}
                        />
                      </Box>
                      <Box display="flex">
                        <Button variant="contained" onClick={handleAddClick}>
                          Adicionar
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                  <Box display="flex" flexDirection="column" gap={1}>
                    {selectedRegions.map((providerRegion) => (
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        gap={1}
                        key={providerRegion.id}
                      >
                        <Select
                          sx={{ flexGrow: 1, maxWidth: '15rem' }}
                          id="acronym-select"
                          value={providerRegion.acronym}
                          label="Provider"
                          onChange={(newAcronym) =>
                            handleAcronymChange(providerRegion.id, newAcronym)
                          }
                        >
                          {providers.map(({ acronym }, index) => (
                            <MenuItem key={index} value={acronym}>
                              {acronym}
                            </MenuItem>
                          ))}
                        </Select>
                        <Select
                          sx={{ flexGrow: 1, maxWidth: '15rem' }}
                          id="region-select"
                          value={providerRegion.region}
                          label="Region"
                          onChange={(event) => handleRegionChange(providerRegion.id, event)}
                        >
                          {Object.keys(
                            providers.find(
                              (provider) => provider.acronym === providerRegion.acronym
                            ).costs
                          ).map((region, index) => (
                            <MenuItem key={index} value={region}>
                              {region}
                            </MenuItem>
                          ))}
                        </Select>
                        <Box
                          display="flex"
                          gap={1}
                          alignItems="center"
                          sx={{ flexGrow: 1, maxWidth: '15rem' }}
                        >
                          <Typography fontWeight="fontWeightMedium">Price:</Typography>
                          <Typography>{computePrice(providerRegion).toFixed(2)}</Typography>
                        </Box>
                        <IconButton
                          aria-label="delete"
                          onClick={() => handleDeleteClick(providerRegion.id)}
                        >
                          <Icon icon="mdi:delete" />
                        </IconButton>
                      </Box>
                    ))}
                  </Box>
                </>
              )}
            </CardContent>
          </Card>
        </Box>
      </Container>
    </Page>
  );
}
export default withSnackbar(CodePrediction)

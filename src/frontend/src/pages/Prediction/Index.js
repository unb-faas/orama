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
  CircularProgress
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
  const [control, setControl] = useState(true);
  const [code, setCode] = useState("// type your code here");
  const [concurrency, setConcurrency] = useState(1);
  const [predicions, setPredictions] = useState({
    "lambda":0,
    "gcf":0,
    "azf":0,
    "afc":0,
  })

  const predict = () =>{

    api.post("analyze",{"code":code}, "halsteader").then(res=>{
      if (res){
        res = res.data
        Object.keys(predicions).forEach((provider) => {
          const payload = {
            "success": 1,
            "concurrency": concurrency,
            "provider": provider,
            "total_operands": res.total_operands,
            "distinct_operands": res.distinct_operands,
            "total_operators": res.total_operators,
            "distinct_operators": res.distinct_operators,
            "time": res.time,
            "bugs": res.bugs,
            "effort": res.effort,
            "volume": res.volume,
            "difficulty": res.difficulty,
            "vocabulary": res.vocabulary,
            "length": res.length
          }
          api.post("predict_latency", payload, "predictor").then(predictedData=>{
            if (predictedData){
              predicions[provider] =  predictedData.data.predicted_latency
              setPredictions(predicions)
            }
          })
        });
      }
    })

  }

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    setControl(!control);
  };

  const handleConcurrencyChange = (event) => {
    setConcurrency(event.target.value);
    setControl(!control);
  };

  useEffect(() => {
    predict()
  },[control]); 

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
                      autoComplete="lambda"
                      type="string"
                      label="Lambda"
                      disabled
                      fullWidth
                      value={predicions.lambda}
                    />
                    <TextField
                      InputLabelProps={{ shrink: true }}
                      autoComplete="lambda"
                      type="string"
                      label="Azure Functions"
                      disabled
                      fullWidth
                      value={predicions.azf}
                    />
                    <TextField
                      InputLabelProps={{ shrink: true }}
                      autoComplete="lambda"
                      type="string"
                      label="Google Cloud Functions"
                      disabled
                      fullWidth
                      value={predicions.gcf}
                    />
                    <TextField
                      InputLabelProps={{ shrink: true }}
                      autoComplete="lambda"
                      type="string"
                      label="Alibaba Functions"
                      disabled
                      fullWidth
                      value={predicions.afc}
                    />
                  </Box>
                </Box>
              </Box> 
            </CardContent>  
          </Card>
        </Box>
      </Container>
    </Page>
  );
}
export default withSnackbar(CodePrediction)

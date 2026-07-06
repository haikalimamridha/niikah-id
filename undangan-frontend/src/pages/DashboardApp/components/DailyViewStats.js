import { useMemo, useState } from 'react';
import { merge } from 'lodash-es';
import { add, sub, endOfDay } from 'date-fns';
import { useQuery } from 'react-query';
import ReactApexChart from 'react-apexcharts';
import { Card, Box, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { BaseOptionChart } from '../../../components/charts';
import { fDate, fDateMonth } from 'src/utils/formatTime';
import Api from 'src/utils/Api';

function generateChartLabel(days) {
  let startChartDate = sub(new Date(), { days });
  const endChartDate = endOfDay(new Date());
  const CHART_LABELS = [];

  const formatDate = days > 7 ? fDateMonth : fDate;

  while (startChartDate <= endChartDate) {
    CHART_LABELS.push(formatDate(startChartDate));
    startChartDate = add(startChartDate, { days: 1 });
  }

  return CHART_LABELS;
}

export default function DailyViewStats() {
  const [filter, setFilter] = useState(7);
  const { data } = useQuery(['userDailyViewStats', filter], () =>
    Api().get('/v1/stats/view-daily', {
      params: {
        start_date: sub(new Date(), { days: filter }),
        end_date: new Date(),
      },
    })
  );

  let CHART_DATA = useMemo(
    () =>
      data?.data?.data?.map((res) => ({
        name: res.title,
        type: 'line',
        data: res.stats.map((stats) => stats.count),
      })) || [],
    [data]
  );

  let CHART_LABEL = useMemo(() => generateChartLabel(filter), [filter]);

  const chartOptions = merge(BaseOptionChart(), {
    plotOptions: { bar: { columnWidth: '11%', borderRadius: 4 } },
    fill: { type: ['solid', 'gradient', 'solid'] },
    labels: CHART_LABEL,
    xaxis: { type: 'datetime' },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (y) => {
          if (typeof y !== 'undefined') {
            return `${y.toFixed(0)} pengunjung`;
          }
          return y;
        },
      },
    },
  });

  return (
    <Card>
      <Box
        sx={{
          mt: 3,
          mx: 5,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="h5"> Pengunjung Undangan </Typography>
        <FormControl sx={{ width: '250px' }}>
          <InputLabel id="demo-simple-select-label">Filter</InputLabel>
          <Select
            size="small"
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={filter}
            label="Filter"
            onChange={(e) => setFilter(e.target.value)}
          >
            <MenuItem value={7}>7 Hari Terakhir</MenuItem>
            <MenuItem value={30}>1 Bulan Terakhir</MenuItem>
            <MenuItem value={90}>3 Bulan Terakhir</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Box sx={{ p: 3, pb: 1 }} dir="ltr">
        <ReactApexChart type="line" series={CHART_DATA} options={chartOptions} height={364} />
      </Box>
    </Card>
  );
}

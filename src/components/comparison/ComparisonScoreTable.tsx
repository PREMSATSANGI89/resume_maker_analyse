import {
  Box,
  Chip,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from '@mui/material';
import { EmojiEventsRounded } from '@mui/icons-material';
import { getScoreColor } from '@/utils/helpers';
import { compareHigherWins } from '@/utils/comparisonHelpers';

interface ScoreMetric {
  label: string;
  valueA: number;
  valueB: number;
}

interface ComparisonScoreTableProps {
  metrics: ScoreMetric[];
  nameA: string;
  nameB: string;
}

const COLORS = {
  success: '#14B8A6',
  warning: '#F59E0B',
  error: '#EF4444',
};

/** Table comparing every score metric side by side, with a per-row progress bar and winner badge. */
export function ComparisonScoreTable({ metrics, nameA, nameB }: ComparisonScoreTableProps) {
  const theme = useTheme();
  const trackColor = theme.palette.mode === 'light' ? '#EEF0F6' : '#1D2740';

  const renderCell = (value: number) => {
    const color = COLORS[getScoreColor(value)];
    return (
      <Stack spacing={0.5} alignItems="center" sx={{ minWidth: 84 }}>
        <Typography
          component="span"
          fontWeight={700}
          sx={{ fontFamily: '"JetBrains Mono", monospace', color }}
        >
          {value}
        </Typography>
        <Box sx={{ width: '100%', height: 6, borderRadius: 3, bgcolor: trackColor, overflow: 'hidden' }}>
          <Box sx={{ width: `${value}%`, height: '100%', bgcolor: color, borderRadius: 3 }} />
        </Box>
      </Stack>
    );
  };

  return (
    <TableContainer sx={{ overflowX: 'auto' }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 700 }}>Metric</TableCell>
            <TableCell align="center" sx={{ fontWeight: 700 }}>
              {nameA}
            </TableCell>
            <TableCell align="center" sx={{ fontWeight: 700 }}>
              {nameB}
            </TableCell>
            <TableCell align="center" sx={{ fontWeight: 700 }}>
              Leader
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {metrics.map((m) => {
            const winner = compareHigherWins(m.valueA, m.valueB);
            return (
              <TableRow key={m.label} hover>
                <TableCell sx={{ fontWeight: 500 }}>{m.label}</TableCell>
                <TableCell align="center">{renderCell(m.valueA)}</TableCell>
                <TableCell align="center">{renderCell(m.valueB)}</TableCell>
                <TableCell align="center">
                  {winner === 'tie' ? (
                    <Chip label="Tie" size="small" variant="outlined" />
                  ) : (
                    <Chip
                      icon={<EmojiEventsRounded sx={{ fontSize: 14 }} />}
                      label={winner === 'A' ? nameA : nameB}
                      size="small"
                      color="success"
                      sx={{ fontWeight: 600 }}
                    />
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

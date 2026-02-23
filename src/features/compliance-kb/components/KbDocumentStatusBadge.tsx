'use client';

import type { ChipProps } from '@mui/material';
import { Chip } from '@mui/material';
import type { ComplianceDocumentStatus } from '../types/complianceKb.types';

const STATUS_CONFIG: Record<
  ComplianceDocumentStatus,
  { label: string; color: ChipProps['color'] }
> = {
  PROCESSING: { label: 'Processando', color: 'warning' },
  READY: { label: 'Pronto', color: 'success' },
  FAILED: { label: 'Falhou', color: 'error' },
};

interface KbDocumentStatusBadgeProps {
  status: ComplianceDocumentStatus;
}

export default function KbDocumentStatusBadge({ status }: KbDocumentStatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  return (
    <Chip
      label={config.label}
      color={config.color}
      size="small"
      variant="outlined"
      sx={{ height: 20, fontSize: 10 }}
    />
  );
}

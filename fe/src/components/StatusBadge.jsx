import { Badge } from '@mantine/core';
import { IconCheck, IconX, IconClock, IconTruck, IconEye } from '@tabler/icons-react';

const StatusBadge = ({ status, size = 'md', showIcon = true, variant = 'filled' }) => {
  const getStatusConfig = (status) => {
    const configs = {
      'Pending Review': {
        color: 'yellow',
        icon: <IconClock size={14} />,
        label: 'Pending',
      },
      'Approved': {
        color: 'green',
        icon: <IconCheck size={14} />,
        label: 'Approved',
      },
      'Delivered': {
        color: 'blue',
        icon: <IconTruck size={14} />,
        label: 'Delivered',
      },
      'Verified': {
        color: 'teal',
        icon: <IconEye size={14} />,
        label: 'Verified',
      },
      'Rejected': {
        color: 'red',
        icon: <IconX size={14} />,
        label: 'Rejected',
      },
      'Acknowledged': {
        color: 'grape',
        icon: <IconCheck size={14} />,
        label: 'Acknowledged',
      }
    };
    return configs[status] || {
      color: 'gray',
      icon: null,
      label: status,
    };
  };

  const config = getStatusConfig(status);

  // Different variants for different appearances
  const getVariantStyles = () => {
    if (variant === 'light') {
      return { backgroundColor: 'transparent' };
    }
    return {};
  };

  return (
    <Badge
      color={config.color}
      size={size}
      variant={variant}
      leftSection={showIcon ? config.icon : null}
      style={{
        minWidth: '100px',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        ...getVariantStyles()
      }}
    >
      {config.label}
    </Badge>
  );
};

export default StatusBadge;
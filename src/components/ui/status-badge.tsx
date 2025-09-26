import { cn } from "@/lib/utils";
import { TransactionStatus } from "@/data/mockData";

interface StatusBadgeProps {
  status: TransactionStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const getStatusStyles = (status: TransactionStatus) => {
    switch (status) {
      case 'pending':
        return 'status-pending';
      case 'paid':
        return 'status-paid';
      case 'confirmed':
        return 'status-confirmed';
      default:
        return 'status-pending';
    }
  };

  const getStatusText = (status: TransactionStatus) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'paid':
        return 'Paid';
      case 'confirmed':
        return 'Confirmed';
      default:
        return 'Unknown';
    }
  };

  return (
    <span className={cn("status-badge", getStatusStyles(status), className)}>
      {getStatusText(status)}
    </span>
  );
}
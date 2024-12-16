import { CustomerList } from '../components/customer-list';
import { useCustomers } from '../hooks/use-customers';

export function CustomersPage() {
  const { customers, isLoading } = useCustomers();

  return <CustomerList customers={customers} isLoading={isLoading} />;
}
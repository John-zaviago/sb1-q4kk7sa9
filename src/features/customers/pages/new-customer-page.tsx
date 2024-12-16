import { useNavigate } from 'react-router-dom';
import { CustomerForm } from '../components/customer-form';
import { Customer } from '@/types/customer';
import { useCustomers } from '../hooks/use-customers';

export function NewCustomerPage() {
  const navigate = useNavigate();
  const { createCustomer } = useCustomers();

  const handleSubmit = async (data: Customer) => {
    try {
      await createCustomer.mutateAsync(data);
      navigate('/dashboard/customers');
    } catch (error) {
      console.error('Failed to create customer:', error);
    }
  };

  return <CustomerForm onSubmit={handleSubmit} />;
}
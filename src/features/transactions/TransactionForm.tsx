'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { useAppStore } from '@/store/useAppStore';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input, Select, Textarea } from '@/components/ui/Input';
import type { Transaction, TransactionFormData } from '@/types';

const schema = z.object({
  description: z.string().min(2, 'Description must be at least 2 characters'),
  amount: z.coerce.number().positive('Amount must be positive'),
  type: z.enum(['income', 'expense', 'transfer']),
  category: z.enum([
    'salary', 'freelance', 'investment', 'food', 'transport', 'housing',
    'entertainment', 'healthcare', 'shopping', 'utilities', 'education', 'travel', 'other',
  ]),
  date: z.string().min(1, 'Date is required'),
  status: z.enum(['completed', 'pending', 'failed']),
  merchant: z.string().optional(),
  notes: z.string().optional(),
});

type FormSchema = z.infer<typeof schema>;

interface TransactionFormProps {
  isOpen: boolean;
  onClose: () => void;
  editTransaction?: Transaction | null;
}

const TYPE_OPTIONS = [
  { value: 'income', label: 'Income' },
  { value: 'expense', label: 'Expense' },
  { value: 'transfer', label: 'Transfer' },
];

const STATUS_OPTIONS = [
  { value: 'completed', label: 'Completed' },
  { value: 'pending', label: 'Pending' },
  { value: 'failed', label: 'Failed' },
];

const CATEGORY_OPTIONS = [
  { value: 'salary', label: 'Salary' },
  { value: 'freelance', label: 'Freelance' },
  { value: 'investment', label: 'Investment' },
  { value: 'food', label: 'Food & Dining' },
  { value: 'transport', label: 'Transport' },
  { value: 'housing', label: 'Housing & Rent' },
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'shopping', label: 'Shopping' },
  { value: 'utilities', label: 'Utilities' },
  { value: 'education', label: 'Education' },
  { value: 'travel', label: 'Travel' },
  { value: 'other', label: 'Other' },
];

export function TransactionForm({ isOpen, onClose, editTransaction }: TransactionFormProps) {
  const { addTransaction, updateTransaction } = useAppStore();
  const isEditing = !!editTransaction;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = useForm<FormSchema>({
    resolver: zodResolver(schema) as any,
    defaultValues: editTransaction
      ? {
          description: editTransaction.description,
          amount: editTransaction.amount,
          type: editTransaction.type,
          category: editTransaction.category,
          status: editTransaction.status,
          date: format(new Date(editTransaction.date), "yyyy-MM-dd'T'HH:mm"),
          merchant: editTransaction.merchant ?? '',
          notes: editTransaction.notes ?? '',
        }
      : {
          type: 'expense',
          category: 'food',
          status: 'completed',
          date: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
        },
  });

  function handleClose() {
    reset();
    onClose();
  }

  async function onSubmit(data: FormSchema) {
    try {
      const formData: TransactionFormData = {
        ...data,
        date: new Date(data.date).toISOString(),
      };

      if (isEditing && editTransaction) {
        updateTransaction(editTransaction.id, formData);
        toast.success('Transaction updated!');
      } else {
        addTransaction(formData);
        toast.success('Transaction added!');
      }
      handleClose();
    } catch {
      toast.error('Something went wrong. Please try again.');
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEditing ? 'Edit Transaction' : 'Add Transaction'}
      description={isEditing ? 'Update transaction details' : 'Record a new financial transaction'}
      size="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          id="description"
          label="Description"
          placeholder="e.g., Monthly Rent, Coffee Shop"
          error={errors.description?.message}
          {...register('description')}
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            id="amount"
            label="Amount ($)"
            type="number"
            step="0.01"
            min="0.01"
            placeholder="0.00"
            error={errors.amount?.message}
            {...register('amount')}
          />
          <Input
            id="date"
            label="Date & Time"
            type="datetime-local"
            error={errors.date?.message}
            {...register('date')}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Select
            id="type"
            label="Type"
            options={TYPE_OPTIONS}
            error={errors.type?.message}
            {...register('type')}
          />
          <Select
            id="category"
            label="Category"
            options={CATEGORY_OPTIONS}
            error={errors.category?.message}
            {...register('category')}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            id="merchant"
            label="Merchant (optional)"
            placeholder="e.g., Amazon, Starbucks"
            {...register('merchant')}
          />
          <Select
            id="status"
            label="Status"
            options={STATUS_OPTIONS}
            error={errors.status?.message}
            {...register('status')}
          />
        </div>

        <Textarea
          id="notes"
          label="Notes (optional)"
          placeholder="Any additional notes..."
          {...register('notes')}
        />

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting} id="submit-transaction">
            {isEditing ? 'Update Transaction' : 'Add Transaction'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

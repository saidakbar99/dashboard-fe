import React, { useState } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import { format } from 'date-fns';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { FloatLabel } from 'primereact/floatlabel';
import { Calendar } from 'primereact/calendar';
import { toast } from 'react-toastify';

const GET_EXPENSES = gql`
  query {
    getExpenses {
      id
      amount
      description
      expense_date
      created_at
      category {
        id
        name
      }
      worker {
        id
        name
      }
      project {
        id
        name
      }
    }
    getProjects {
      id
      name
    }
    getWorkers {
      id
      name
    }
    getExpenseCategories{
      id
      name
    }
  }
`;

const CREATE_EXPENSE = gql`
  mutation CreateExpense(
    $amount: Float!
    $category: String!
    $expense_date: DateTime!
    $description: String
    $worker: String
    $project: String
  ) {
    createExpense(
      amount: $amount
      category: $category
      expense_date: $expense_date
      description: $description
      worker: $worker
      project: $project
    ) {
      id
      amount
      description
      expense_date
    }
  }
`;

const UPDATE_EXPENSE = gql`
  mutation UpdateExpense(
    $id: String!
    $amount: Float
    $description: String
    $category: String
    $worker: String
    $project: String
    $expense_date: DateTime
  ) {
    updateExpense(
      id: $id
      amount: $amount
      description: $description
      category: $category
      worker: $worker
      project: $project
      expense_date: $expense_date
    ) {
      id
      amount
      description
      expense_date
      category {
        name
      }
      worker {
        name
      }
      project {
        name
      }
    }
  }
`;

export const ExpensesPage = () => {
  const { loading: getExpensesLoading, data: expenses, refetch } = useQuery(GET_EXPENSES);
  const [createExpenseMutation, { loading: createExpenseLoading }] = useMutation(CREATE_EXPENSE);
  const [updateExpenseMutation, { loading: updateExpenseLoading }] = useMutation(UPDATE_EXPENSE);

  const initialData = {
    amount: 0,
    project: null,
    worker: null,
    category: null,
    description: '',
    expense_date: new Date(),
  }
  const [isEdit, setIsEdit] = useState(false)
  const [formState, setFormState] = useState(initialData);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const priceBodyTemplate = (rowData) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(rowData.amount);
  };

  const openDialog = (rowData) => {
    setFormState(rowData)
    setShowCreateModal(true);
    setIsEdit(true)
  };

  const updateFormState = (field, value) => {
    setFormState((prevState) => ({ ...prevState, [field]: value }));
  };

  const handleDialogHide = () => {
    if (!showCreateModal) {
      return
    }
    setShowCreateModal(false)
    setFormState(initialData)
    setIsEdit(false)
  } 

  const validateForm = () => {
    if (!formState.amount || !formState.category.id || !formState.expense_date) {
      toast.warning("Amount, category, and date are required.");
      return false;
    }
    return true;
  };

  if (getExpensesLoading) {
    return <></>
  }

  const createExpense = async () => {
    if (!validateForm()) return;

    try {
      await createExpenseMutation({
        variables: {
          amount: formState.amount,
          category: formState.category?.id,
          expense_date: formState.expense_date.toISOString(),
          description: formState.description,
          worker: formState.worker?.id,
          project: formState.project?.id,
        },
      });
      refetch()
      toast.success('Expense is successfully created!')
      setShowCreateModal(false)
      setFormState(initialData)
    } catch (error) {
      toast.error('Error during expense creation!')
      console.error('Error: ', error)
    }
  }

  const updateExpense = async () => {
    try {
      await updateExpenseMutation({
        variables: {
          id: formState.id,
          amount: formState.amount,
          category: formState.category?.id,
          expense_date: new Date(formState.expense_date).toISOString(),
          description: formState.description,
          worker: formState.worker?.id,
          project: formState.project?.id,
        },
      });
      refetch()
      toast.success('Expense is successfully edited!')
      setIsEdit(false)
      setShowCreateModal(false)
    } catch (error) {
      toast.error('Error during expense edit!')
      console.error('Error updating expense:', error);
    }
  };

  return (
    <div>
      <h3 className='text-3xl text-semibold text-gray mb-4'>Expense Page</h3>
      <Button 
        label="Harajat qo'shish" 
        icon="pi pi-plus" 
        onClick={() => setShowCreateModal(true)} 
        className='mb-4' 
      />

      <Dialog 
        header={isEdit ? 'Edit Expense' : 'New Expense'} 
        visible={showCreateModal}
        className='w-1/2'
        onHide={handleDialogHide}
        breakpoints={{ '960px': '75vw', '641px': '100vw' }}
      >
        <div className='flex mb-3'>
          <div className="p-inputgroup flex-1 mr-12">
            <span className="p-inputgroup-addon">$</span>
            <InputNumber 
              value={formState.amount} 
              onChange={(e) => updateFormState('amount', e.value)} 
              placeholder="Price" 
            />
            <span className="p-inputgroup-addon">.00</span>
          </div>
          <Calendar 
            value={isEdit ? new Date(formState.expense_date) : formState.expense_date} 
            onChange={(e) => updateFormState('expense_date', e.value)} 
          />
        </div>
        <Dropdown 
          value={isEdit ? formState?.project.name : formState.project} 
          onChange={(e) => updateFormState('project', e.value)} 
          options={expenses.getProjects} 
          optionLabel="name"
          optionValue={isEdit ? "name" : ""}
          placeholder="Select a Project"
          className="w-full md:w-14rem mb-3"
        />
        <Dropdown 
          value={isEdit ? formState?.category.name : formState.category} 
          onChange={(e) => updateFormState('category', e.value)} 
          options={expenses.getExpenseCategories} 
          optionLabel="name"
          optionValue={isEdit ? "name" : ""}
          placeholder="Select an Expense Category"
          className="w-full md:w-14rem mb-3"
        />
        <Dropdown 
          value={isEdit ? formState?.worker.name : formState.worker} 
          onChange={(e) => updateFormState('worker', e.value)} 
          options={expenses.getWorkers} 
          optionLabel="name"
          optionValue={isEdit ? "name" : ""}
          placeholder="Select an Employee"
          className="w-full md:w-14rem mb-3"
        />
        <div className='flex justify-between items-center'>
          <FloatLabel>
            <InputTextarea 
              autoResize 
              id="description" 
              value={formState.description} 
              onChange={(e) => updateFormState('description', e.target.value)} 
              rows={2} 
              cols={30} 
            />
            <label htmlFor="description">Description</label>
          </FloatLabel>
          {isEdit ? (
            <div>
              <Button 
                label="Delete Expense" 
                icon="pi pi-trash" 
                className='h-fit item-center mr-4'
                disabled={true}
              />
              <Button 
                label="Edit Expense" 
                icon="pi pi-check" 
                onClick={() => updateExpense()}
                className='h-fit item-center'
                disabled={updateExpenseLoading}
              />
            </div>
          ) : (
            <Button 
              label="Create Expense" 
              icon="pi pi-check" 
              onClick={() => createExpense()}
              className='h-fit item-center'
              disabled={createExpenseLoading}
            />
          )}
          
        </div>
      </Dialog>

      <DataTable 
        paginator
        rows={5}
        value={expenses.getExpenses} 
        editMode="row" 
        dataKey="id"  
      >
        <Column field="amount" header="Amount" body={priceBodyTemplate} style={{ width: '10%' }}></Column>
        <Column field="project.name" header="Project" style={{ width: '15%' }}></Column>
        <Column field="category.name" header="Category" style={{ width: '15%' }}></Column>
        <Column field="worker.name" header="Worker" style={{ width: '15%' }}></Column>
        <Column field="description" header="Description" style={{ width: '20%' }}></Column>
        <Column
          field="expense_date"
          header="Date"
          style={{ width: '15%' }}
          body={(rowData) => format(new Date(rowData.expense_date), 'yyyy-MM-dd')}
        ></Column>
        <Column 
          rowEditor 
          editorButton 
          headerStyle={{ minWidth: '4rem' }} 
          bodyStyle={{ textAlign: 'center' }}
          body={(rowData) => (
            <Button icon="pi pi-pencil" onClick={() => openDialog(rowData)} />
          )}
        ></Column>
      </DataTable>
    </div>
  )
}

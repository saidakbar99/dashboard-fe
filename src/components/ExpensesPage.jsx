import React, { useState } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
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
        name
      }
      worker {
        name
      }
      project {
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
    $expenseDate: DateTime!
    $description: String
    $worker: String
    $project: String
  ) {
    createExpense(
      amount: $amount
      category: $category
      expense_date: $expenseDate
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

export const ExpensesPage = () => {
  const { loading: getExpensesLoading, data: expenses } = useQuery(GET_EXPENSES);
  const [createExpenseMutation, { loading: createExpenseLoading, error }] = useMutation(CREATE_EXPENSE);
  const [visible, setVisible] = useState(false);
  const [formState, setFormState] = useState({
    expenseAmount: 0,
    selectedProject: null,
    selectedEmployee: null,
    selectedCategory: null,
    description: '',
    date: new Date(),
  });

  const updateFormState = (field, value) => {
    setFormState((prevState) => ({ ...prevState, [field]: value }));
  };

  const validateForm = () => {
    if (!formState.expenseAmount || !formState.selectedCategory.id || !formState.date) {
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
          amount: formState.expenseAmount,
          category: formState.selectedCategory?.id,
          expenseDate: formState.date.toISOString(),
          description: formState.description,
          worker: formState.selectedEmployee?.id,
          project: formState.selectedProject?.id,
        },
      });
      toast.success('Expense is successfully created!')
      setVisible(false)
    } catch (error) {
      toast.error('Error during expense creation!')
      console.error('Error: ', error)
    }
  }

  return (
    <div>
      <Button 
        label="Harajat qo'shish" 
        icon="pi pi-plus" 
        onClick={() => setVisible(true)} 
        className='my-2' 
      />
      <Dialog 
        header="Yangi Harajat" 
        visible={visible} 
        style={{ width: '50vw' }} 
        onHide={() => {if (!visible) return; setVisible(false); }}
        breakpoints={{ '960px': '75vw', '641px': '100vw' }}
      >
        <div className='flex mb-3'>
          <div className="p-inputgroup flex-1 mr-12">
            <span className="p-inputgroup-addon">$</span>
            <InputNumber 
              value={formState.expenseAmount} 
              onChange={(e) => updateFormState('expenseAmount',e.value)} 
              placeholder="Price" 
            />
            <span className="p-inputgroup-addon">.00</span>
          </div>
          <Calendar value={formState.date} onChange={(e) => updateFormState('date',e.value)} />
        </div>
        <Dropdown 
          value={formState.selectedProject} 
          onChange={(e) => updateFormState('selectedProject',e.value)} 
          options={expenses.getProjects} 
          optionLabel="name"
          placeholder="Select a Project"
          className="w-full md:w-14rem mb-3"
        />
        <Dropdown 
          value={formState.selectedCategory} 
          onChange={(e) => updateFormState('selectedCategory',e.value)} 
          options={expenses.getExpenseCategories} 
          optionLabel="name"
          placeholder="Select an Expense Category"
          className="w-full md:w-14rem mb-3"
        />
        <Dropdown 
          value={formState.selectedEmployee} 
          onChange={(e) => updateFormState('selectedEmployee',e.value)} 
          options={expenses.getWorkers} 
          optionLabel="name"
          placeholder="Select an Employee"
          className="w-full md:w-14rem mb-3"
        />
        <div className='flex justify-between items-center'>
          <FloatLabel>
            <InputTextarea 
              autoResize 
              id="description" 
              value={formState.description} 
              onChange={(e) => updateFormState('description',e.target.value)} 
              rows={2} 
              cols={30} 
            />
            <label htmlFor="description">Description</label>
          </FloatLabel>
          <Button 
            label="Harajatni saqlash" 
            icon="pi pi-check" 
            onClick={() => createExpense()}
            className='h-fit item-center'
            disabled={createExpenseLoading}
          />
        </div>
      </Dialog>
      <DataTable 
        paginator
        rows={5}
        value={expenses.getExpenses} 
        editMode="row" 
        dataKey="id"  
      >
        <Column field="amount" header="Amount" style={{ width: '15%' }}></Column>
        <Column field="project.name" header="Project" style={{ width: '15%' }}></Column>
        <Column field="category.name" header="Category" style={{ width: '15%' }}></Column>
        <Column field="worker.name" header="Worker" style={{ width: '15%' }}></Column>
        <Column field="description" header="Description" style={{ width: '20%' }}></Column>
        <Column field="expense_date" header="Date" style={{ width: '15%' }}></Column>
        <Column rowEditor headerStyle={{ minWidth: '4rem' }} bodyStyle={{ textAlign: 'center' }}></Column>
      </DataTable>
    </div>
  )
}

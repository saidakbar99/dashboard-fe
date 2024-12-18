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
import { CREATE_EXPENSE, GET_EXPENSES, UPDATE_EXPENSE, DELETE_EXPENSE } from '../graphql';

export const ExpensesPage = () => {
  const { loading: getExpensesLoading, data: expenses, refetch } = useQuery(GET_EXPENSES);
  const [createExpenseMutation, { loading: createExpenseLoading }] = useMutation(CREATE_EXPENSE);
  const [updateExpenseMutation, { loading: updateExpenseLoading }] = useMutation(UPDATE_EXPENSE);
  const [deleteExpenseMutation, { loading: deleteExpenseLoading }] = useMutation(DELETE_EXPENSE);

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

  const deleteExpense = async () => {
    try {
      await deleteExpenseMutation({
        variables: { id: formState.id },
      });
      refetch()
      toast.success('Expense is successfully deleted!')
      setIsEdit(false)
      setShowCreateModal(false)
    } catch (error) {
      toast.error('Error during expense deletion!')
      console.error('Error deleting expense:', error);
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
        className='w-[600px]'
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
        <div className='flex justify-end items-center mt-4'>
          {isEdit ? (
            <div>
              <Button 
                label="Delete Expense" 
                icon="pi pi-trash" 
                onClick={() => deleteExpense()}
                className='h-fit item-center mr-4'
                disabled={deleteExpenseLoading}
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

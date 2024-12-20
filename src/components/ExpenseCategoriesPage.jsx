import React, { useState } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import { format } from 'date-fns';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { FloatLabel } from 'primereact/floatlabel';
import { toast } from 'react-toastify';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { GET_CATEGORIES, CREATE_CATEGORY, DELETE_CATEGORY } from '../graphql';

export const ExpenseCategoriesPage = () => {
  const { loading: getExpenseCategoriesLoading, data: expenseCategories, refetch } = useQuery(GET_CATEGORIES);DELETE_CATEGORY
  const [createExpenseCategoryMutation, { loading: createExpenseCategoryLoading }] = useMutation(CREATE_CATEGORY);
  const [deleteExpenseCategoryMutation, { loading: deleteExpenseCategoryLoading }] = useMutation(DELETE_CATEGORY);
  const initialData = {
    name: '',
    description: '',
  }
  const [isEdit, setIsEdit] = useState(false)
  const [formState, setFormState] = useState(initialData);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const priceBodyTemplate = (rowData) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(rowData.expense_amount);
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
    if (!formState.name || !formState.description) {
      toast.warning("Name and Description are required.");
      return false;
    }
    return true;
  };

  if (getExpenseCategoriesLoading) {
    return <></>
  }
  deleteExpenseCategoryMutation
  const createExpenseCategory = async () => {
    if (!validateForm()) return;

    try {
      await createExpenseCategoryMutation({
        variables: {
          name: formState.name,
          description: formState.description,
        },
      });
      refetch()
      toast.success('Expense Category is successfully created!')
      setFormState(initialData)
      setShowCreateModal(false)
    } catch (error) {
      toast.error('Error during expense category creation!')
      console.error('Error: ', error)
    }
  }

  const deleteExpenseCategory = async () => {
    try {
      await deleteExpenseCategoryMutation({
        variables: { id: formState.id },
      });
      refetch()
      toast.success('Expense Category is successfully deleted!')
      setFormState(initialData)
      setShowCreateModal(false)
    } catch (error) {
      toast.error('If there is expense on this category, You cannot delete this Category!')
      console.error('Error: ', error)
    }
  }

  return (
    <div>
      <h3 className='text-3xl text-semibold text-gray mb-4'>Categories Page</h3>
      <Button 
        label="Add Expense Category" 
        icon="pi pi-plus" 
        onClick={() => setShowCreateModal(true)} 
        className='mb-4' 
      />

      <Dialog 
        header={isEdit ? 'Edit Expense Category' : 'New Expense Category'} 
        visible={showCreateModal}
        className='w-[400px]'
        onHide={handleDialogHide}
        breakpoints={{ '960px': '75vw', '641px': '100vw' }}
      >
        <FloatLabel className='mt-2'>
          <InputText className='w-full' id="name" value={formState.name} onChange={(e) => updateFormState('name', e.target.value)} />
          <label htmlFor="name">Expense Category Name</label>
        </FloatLabel>
        <FloatLabel className='my-4'>
          <InputTextarea className='w-full' id="description" value={formState.description} onChange={(e) => updateFormState('description', e.target.value)} />
          <label htmlFor="description">Description</label>
        </FloatLabel>
        <div className='flex justify-end items-end'>
          {isEdit ? (
            <div>
              <Button 
                label="Delete Category" 
                icon="pi pi-trash" 
                onClick={() => deleteExpenseCategory()}
                className='h-fit item-center mr-4'
                disabled={deleteExpenseCategoryLoading}
              />
              <Button 
                label="Edit Category" 
                icon="pi pi-check" 
                className='h-fit item-center'
                disabled={true}
              />
            </div>
          ) : (
            <Button 
              label="Create Category" 
              icon="pi pi-check" 
              onClick={() => createExpenseCategory()}
              disabled={createExpenseCategoryLoading}
            />
          )}
        </div>
      </Dialog>

      <DataTable 
        paginator
        rows={5}
        value={expenseCategories.getExpenseCategories} 
        editMode="row" 
        dataKey="id"
      >
        <Column field="name" header="Expense Category" ></Column>
        <Column field="expense_amount" header="Expense Amount" body={priceBodyTemplate}></Column>
        <Column field="description" header="Description" ></Column>
        <Column
          field="created_at"
          header="Date"
          body={(rowData) => format(new Date(rowData.created_at), 'yyyy-MM-dd')}
        ></Column>
        <Column 
          rowEditor 
          editorButton 
          bodyStyle={{ textAlign: 'center' }}
          body={(rowData) => (
            <Button icon="pi pi-pencil" onClick={() => openDialog(rowData)} />
          )}
        ></Column>
      </DataTable>
    </div>
  )
}

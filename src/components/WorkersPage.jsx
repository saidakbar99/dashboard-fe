import React, { useState } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import { format } from 'date-fns';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { FloatLabel } from 'primereact/floatlabel';
import { toast } from 'react-toastify';
import { InputText } from 'primereact/inputtext';

const GET_WORKERS = gql`
  query {
    getWorkers{
      id
      name
      role
      salary
      created_at
    }
  }
`;

const CREATE_WORKER = gql`
  mutation CreateWorker(
    $salary: Float!
    $name: String!
    $role: String!
  ) {
    createWorker(
      salary: $salary
      name: $name
      role: $role
    ) {
      salary
      name
      role
    }
  }
`;

export const WorkersPage = () => {
  const { loading: getWorkersLoading, data: workers, refetch } = useQuery(GET_WORKERS);
  const [createWorkerMutation, { loading: createWorkerLoading }] = useMutation(CREATE_WORKER);
  const initialData = {
    name: '',
    role: '',
    salary: 0,
  }
  const [isEdit, setIsEdit] = useState(false)
  const [formState, setFormState] = useState(initialData);
  const [showCreateModal, setShowCreateModal] = useState(false);

  console.log('>>>formState',formState)

  const priceBodyTemplate = (rowData) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(rowData.salary);
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
    if (!formState.name || !formState.role || !formState.salary) {
      toast.warning("Salary, Name, and Role are required.");
      return false;
    }
    return true;
  };

  if (getWorkersLoading) {
    return <></>
  }

  const createWorker = async () => {
    if (!validateForm()) return;

    try {
      await createWorkerMutation({
        variables: {
          salary: formState.salary,
          name: formState.name,
          role: formState.role,
        },
      });
      refetch()
      toast.success('Worker is successfully created!')
      setFormState(initialData)
      setShowCreateModal(false)
    } catch (error) {
      toast.error('Error during worker creation!')
      console.error('Error: ', error)
    }
  }

  return (
    <div>
      <h3 className='text-3xl text-semibold text-gray mb-4'>Worker Page</h3>
      <Button 
        label="Add Worker" 
        icon="pi pi-plus" 
        onClick={() => setShowCreateModal(true)} 
        className='mb-4' 
      />

      <Dialog 
        header={isEdit ? 'Edit Worker' : 'New Worker'} 
        visible={showCreateModal}
        className='w-[400px]'
        onHide={handleDialogHide}
        breakpoints={{ '960px': '75vw', '641px': '100vw' }}
      >
        <FloatLabel className='mt-2'>
          <InputText className='w-full' id="name" value={formState.name} onChange={(e) => updateFormState('name', e.target.value)} />
          <label htmlFor="name">Name</label>
        </FloatLabel>
        <FloatLabel className='my-4'>
          <InputText className='w-full' id="role" value={formState.role} onChange={(e) => updateFormState('role', e.target.value)} />
          <label htmlFor="role">Role</label>
        </FloatLabel>
        <div className='flex mb-4'>
          <div className="p-inputgroup flex-1">
            <FloatLabel>
              <span className="p-inputgroup-addon">$</span>
              <InputNumber 
                value={formState.salary}
                onChange={(e) => updateFormState('salary', e.value)} 
                placeholder="Price"
                id='salary'
              />
              <label className='ml-10' htmlFor="salary">Salary</label>
            </FloatLabel>
          </div>
        </div>
        <div className='flex justify-end items-end'>
          {isEdit ? (
            <div>
              <Button 
                label="Delete Worker" 
                icon="pi pi-trash" 
                className='h-fit item-center mr-4'
                disabled={true}
              />
              <Button 
                label="Edit Worker" 
                icon="pi pi-check" 
                className='h-fit item-center'
                disabled={true}
              />
            </div>
          ) : (
            <Button 
              label="Create Worker" 
              icon="pi pi-check" 
              onClick={() => createWorker()}
              disabled={createWorkerLoading}
            />
          )}
        </div>
      </Dialog>

      <DataTable 
        paginator
        rows={5}
        value={workers.getWorkers} 
        editMode="row" 
        dataKey="id"
      >
        <Column field="name" header="Project" ></Column>
        <Column field="role" header="Role" ></Column>
        <Column field="salary" header="Salary" body={priceBodyTemplate} ></Column>
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

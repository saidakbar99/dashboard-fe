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
import { CREATE_PROJECT, GET_PROJECTS, DELETE_PROJECT } from '../graphql';

export const ProjectsPage = () => {
  const { loading: getProjectsLoading, data: projects, refetch } = useQuery(GET_PROJECTS);DELETE_PROJECT
  const [createProjectMutation, { loading: createProjectLoading }] = useMutation(CREATE_PROJECT);
  const [deleteProjectMutation, { loading: deleteProjectLoading }] = useMutation(DELETE_PROJECT);
  const initialData = {
    name: '',
    description: '',
  }
  const [isEdit, setIsEdit] = useState(false)
  const [formState, setFormState] = useState(initialData);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const priceBodyTemplate = (rowData) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(rowData.income_amount);
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

  if (getProjectsLoading) {
    return <></>
  }
  
  const createProject = async () => {
    if (!validateForm()) return;

    try {
      await createProjectMutation({
        variables: {
          name: formState.name,
          description: formState.description,
        },
      });
      refetch()
      toast.success('Project is successfully created!')
      setFormState(initialData)
      setShowCreateModal(false)
    } catch (error) {
      toast.error('Error during project creation!')
      console.error('Error: ', error)
    }
  }

  const deleteProject = async () => {
    try {
      await deleteProjectMutation({
        variables: { id: formState.id },
      });
      refetch()
      toast.success('Project is successfully deleted!')
      setFormState(initialData)
      setShowCreateModal(false)
    } catch (error) {
      toast.error('Error during project deletion!')
      console.error('Error: ', error)
    }
  }

  return (
    <div>
      <h3 className='text-3xl text-semibold text-gray mb-4'>Project Page</h3>
      <Button 
        label="Add Project" 
        icon="pi pi-plus" 
        onClick={() => setShowCreateModal(true)} 
        className='mb-4' 
      />
      <Dialog 
        header={isEdit ? 'Edit Project' : 'New Project'} 
        visible={showCreateModal}
        className='w-[400px]'
        onHide={handleDialogHide}
        breakpoints={{ '960px': '75vw', '641px': '100vw' }}
      >
        <FloatLabel className='mt-2'>
          <InputText className='w-full' id="name" value={formState.name} onChange={(e) => updateFormState('name', e.target.value)} />
          <label htmlFor="name">Project Name</label>
        </FloatLabel>
        <FloatLabel className='my-4'>
          <InputTextarea className='w-full' id="description" value={formState.description} onChange={(e) => updateFormState('description', e.target.value)} />
          <label htmlFor="description">Description</label>
        </FloatLabel>
        <div className='flex justify-end items-end'>
          {isEdit ? (
            <div>
              <Button 
                label="Delete Project" 
                icon="pi pi-trash" 
                onClick={() => deleteProject()}
                className='h-fit item-center mr-4'
                disabled={deleteProjectLoading}
              />
              <Button 
                label="Edit Project" 
                icon="pi pi-check" 
                className='h-fit item-center'
                disabled={true}
              />
            </div>
          ) : (
            <Button 
              label="Create Project" 
              icon="pi pi-check" 
              onClick={() => createProject()}
              disabled={createProjectLoading}
            />
          )}
        </div>
      </Dialog>

      <DataTable 
        paginator
        rows={5}
        value={projects.getProjects} 
        editMode="row" 
        dataKey="id"
      >
        <Column field="name" header="Project" ></Column>
        <Column field="income_amount" header="Income Amount" body={priceBodyTemplate}></Column>
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

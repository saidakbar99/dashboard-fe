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

const GET_INCOMES = gql`
  query {
    getIncomes{
      id
      amount
      description
      project{
        name
      }
      created_at
      income_date
    }
    getProjects {
      id
      name
    }
  }
`;

const CREATE_INCOME = gql`
  mutation CreateIncome(
    $amount: Float!
    $project: String!
    $income_date: DateTime!
    $description: String
  ) {
    createIncome(
      amount: $amount
      project: $project
      income_date: $income_date
      description: $description
    ) {
      amount
      description
      income_date
    }
  }
`;

export const IncomesPage = () => {
  const { loading: getIncomesLoading, data: incomes, refetch } = useQuery(GET_INCOMES);
  const [createIncomeMutation, { loading: createIncomeLoading }] = useMutation(CREATE_INCOME);
  const initialData = {
    amount: 0,
    project: null,
    description: '',
    income_date: new Date(),
  }
  const [isEdit, setIsEdit] = useState(false)
  const [formState, setFormState] = useState(initialData);
  const [showCreateModal, setShowCreateModal] = useState(false);
  console.log('>>>incomes',incomes)

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
    if (!formState.amount || !formState.project.id || !formState.income_date) {
      toast.warning("Amount, project, and date are required.");
      return false;
    }
    return true;
  };

  if (getIncomesLoading) {
    return <></>
  }

  const createIncome = async () => {
    if (!validateForm()) return;

    try {
      await createIncomeMutation({
        variables: {
          amount: formState.amount,
          income_date: formState.income_date,
          description: formState.description || null,
          project: formState.project.id,
        },
      });
      refetch()
      toast.success('Income is successfully created!')
      setFormState(initialData)
      setShowCreateModal(false)
    } catch (error) {
      toast.error('Error during income creation!')
      console.error('Error: ', error)
    }
  }

  return (
    <div>
      <h3 className='text-3xl text-semibold text-gray mb-4'>Income Page</h3>
      <Button 
        label="Add Income" 
        icon="pi pi-plus" 
        onClick={() => setShowCreateModal(true)} 
        className='mb-4' 
      />

      <Dialog 
        header={isEdit ? 'Edit Income' : 'New Income'} 
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
            value={isEdit ? new Date(formState.income_date) : formState.income_date} 
            onChange={(e) => updateFormState('income_date', e.value)} 
          />
        </div>
        <Dropdown 
          value={isEdit ? formState?.project.name : formState.project} 
          onChange={(e) => updateFormState('project', e.value)} 
          options={incomes.getProjects} 
          optionLabel="name"
          optionValue={isEdit ? "name" : ""}
          placeholder="Select a Project"
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
                label="Delete Income" 
                icon="pi pi-trash" 
                className='h-fit item-center mr-4'
                disabled={true}
              />
              <Button 
                label="Edit Income" 
                icon="pi pi-check" 
                // onClick={() => updateIncome()}
                className='h-fit item-center'
                disabled={true}
              />
            </div>
          ) : (
            <Button 
              label="Create Income" 
              icon="pi pi-check" 
              onClick={() => createIncome()}
              className='h-fit item-center'
              disabled={createIncomeLoading}
            />
          )}
        </div>
      </Dialog>

      <DataTable 
        paginator
        rows={5}
        value={incomes.getIncomes} 
        editMode="row" 
        dataKey="id"
      >
        <Column field="amount" header="Amount" body={priceBodyTemplate}></Column>
        <Column field="project.name" header="Project"></Column>
        <Column field="description" header="Description"></Column>
        <Column
          field="income_date"
          header="Date"
          body={(rowData) => format(new Date(rowData.income_date), 'yyyy-MM-dd')}
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

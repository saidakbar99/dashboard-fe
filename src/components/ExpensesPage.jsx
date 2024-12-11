import React, { useEffect, useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { Tag } from 'primereact/tag';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { FloatLabel } from 'primereact/floatlabel';
import { Calendar } from 'primereact/calendar';

const GET_EXPENSES = gql`
  query {
    getExpenses {
      id
      amount
      description
      expense_type
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
      name
    }
    getWorkers {
      name
    }
    getExpenseCategories{
      name
    }
  }
`;

export const ExpensesPage = () => {
  const { loading, data: expenses } = useQuery(GET_EXPENSES);
  const [visible, setVisible] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());

  if (loading) {
    return <></>
  }

  console.log('>>>data',expenses)
  return (
    <div className="">
      <span>Expenses Page</span>
      <div>
        <Button label="Harajat qo'shish" icon="pi pi-plus" onClick={() => setVisible(true)} className='my-2' />
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
              <InputNumber placeholder="Price" />
              <span className="p-inputgroup-addon">.00</span>
            </div>
            <Calendar value={date} onChange={(e) => setDate(e.value)} />
          </div>
          <Dropdown 
            value={selectedProject} 
            onChange={(e) => setSelectedProject(e.value)} 
            options={expenses.getProjects} 
            optionLabel="name"
            placeholder="Select a Project"
            className="w-full md:w-14rem mb-3"
          />
          <Dropdown 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.value)} 
            options={expenses.getExpenseCategories} 
            optionLabel="name"
            placeholder="Select an Expense Category"
            className="w-full md:w-14rem mb-3"
          />
          <Dropdown 
            value={selectedEmployee} 
            onChange={(e) => setSelectedEmployee(e.value)} 
            options={expenses.getWorkers} 
            optionLabel="name"
            placeholder="Select an Employee"
            className="w-full md:w-14rem mb-3"
          />
          <div className='flex justify-between'>
            <FloatLabel>
              <InputTextarea autoResize id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={2} cols={30} />
              <label htmlFor="description">Description</label>
            </FloatLabel>
            <Button 
              label="Harajatni saqlash" 
              icon="pi pi-check" 
              onClick={() => setVisible(false)}
              className='h-fit item-center'
            />
          </div>

        </Dialog>
        <DataTable value={expenses.getExpenses} editMode="row" dataKey="id"  tableStyle={{ minWidth: '50rem' }}>
        <Column field="amount" header="Amount" style={{ width: '15%' }}></Column>
          {/* <Column field="expense_type" header="Type" style={{ width: '15%' }}></Column> */}
          <Column field="project.name" header="Project" style={{ width: '15%' }}></Column>
          <Column field="category.name" header="Category" style={{ width: '15%' }}></Column>
          <Column field="worker.name" header="Worker" style={{ width: '15%' }}></Column>
          <Column field="description" header="Description" style={{ width: '20%' }}></Column>
          <Column field="expense_date" header="Date" style={{ width: '15%' }}></Column>
          <Column rowEditor headerStyle={{ minWidth: '4rem' }} bodyStyle={{ textAlign: 'center' }}></Column>
      </DataTable>
      </div>
    </div>
  )
}
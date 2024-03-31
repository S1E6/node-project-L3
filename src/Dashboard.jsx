import './App.css'
import React, { useState, useEffect, useRef  } from 'react';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column'; 
import axios from "axios";
import { Tag } from 'primereact/tag';
import { deleteIcon, editIcon,addIcon } from './IconF';
import { Dialog } from 'primereact/dialog';  
import { ConfirmPopup } from 'primereact/confirmpopup'; 
import { confirmPopup } from 'primereact/confirmpopup';  
import { Toast } from 'primereact/toast';
import { TreeSelect } from 'primereact/treeselect';
import { InputText } from 'primereact/inputtext';
import './Dashboard.css'
import { useAuth } from './AuthContext';
        
function Dashboard() {
  const [materials, setMaterials] = useState([]);
  const [stat, setStat] = useState([]);
  const [visibleAdd, setVisibleAdd] = useState(false);
  const [visibleEdit, setVisibleEdit] = useState(false);
  const toast = useRef(null);  
  const { logout } = useAuth();
  const etatData = [
    { key: 'Bon', label: 'Bon'},
    { key: 'Abimé', label: 'Abimé' },
    { key: 'Mauvais', label: 'Mauvais'}
  ];
  const [selectedEtatAdd, setSelectedEtatAdd] = useState(null);
  const [designValueAdd, setDesignValueAdd] = useState('');
  const [qteValueAdd, setQteValueAdd] = useState('');

  const [selectedEtatEdit, setSelectedEtatEdit] = useState(null);
  const [designValueEdit, setDesignValueEdit] = useState('');
  const [qteValueEdit, setQteValueEdit] = useState('');
  const [idEdit,setId] = useState('');
  const [loading, setLoading] = useState(false);

  const load = () => {
      setLoading(true);
      logout();
      setLoading(false);
   
  };
  const reject = () => {
      toast.current.show({ severity: 'warn', summary: '', detail: 'Action annulé', life: 3000 });
  };
    
  const confirm = (event,material) => {
    
    confirmPopup({
        target: event.currentTarget,
        message: 'Voulez vous supprimer ' +material.design+' ?',
        icon: 'pi pi-info-circle',
        defaultFocus: 'reject',
        acceptClassName: 'p-button-danger',
        accept: () => handleDelete(material.numeroMaterial),
        reject
    });
  };
  const handleDelete = (materialId) => {
    axios.delete(`http://localhost:8000/api/material/${materialId}`)
      .then((response) => {
        console.log('Material deleted successfully:', response.data);
        fetchAllData();
        toast.current.show({ severity: 'success', summary: 'Supprimé', detail: 'Materiel supprimé', life: 3000 });
      })
      .catch((error) => {
        console.error('Error deleting material:', error);
        toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to delete material', life: 3000 });
      });
  };
  
  const handleAddSubmit =() => {
    if(designValueAdd == '' || qteValueAdd == '' || selectedEtatAdd == ''){
      toast.current.show({ severity: 'warn', summary: '', detail: 'Verifiez le formulaire', life: 3000 });
    }
    else{
    console.log(designValueAdd,qteValueAdd,selectedEtatAdd);
    axios.post('http://localhost:8000/api/material/', { 
      design:designValueAdd,
      quantite:parseInt(qteValueAdd),
      etat:selectedEtatAdd })
    .then((response) => {
      console.log('Material added successfully:', response.data);
      fetchAllData(); // Re-fetch data to update the table
      setVisibleAdd(false); // Fermer le dialogue d'ajout
      toast.current.show({ severity: 'success', summary: '', detail: designValueAdd+' ajouté avec succés', life: 3000 });
      setDesignValueAdd('')
      setQteValueAdd('')
      setSelectedEtatAdd('')
    })
    .catch((error) => {
      console.error('Error adding material:', error);
      toast.current.show({ severity: 'error', summary: '', detail: 'Ajout echoué', life: 3000 });
    });
  }
  }
  const handleEditData =(material)=>{
    setVisibleEdit(true)
    console.log(material);
    setId(material.numeroMaterial)
    setDesignValueEdit(material.design)
      setQteValueEdit(material.quantite)
      setSelectedEtatEdit(material.etat)
  }
  const handleEditSubmit =() => {
    axios.put(`http://localhost:8000/api/material/${parseInt(idEdit)}`, { 
        design: designValueEdit,
        quantite: parseInt(qteValueEdit),
        etat: selectedEtatEdit 
      })
      .then((response) => {
        console.log('Material updated successfully:', response.data);
        fetchAllData(); // Re-fetch data to update the table
        setVisibleEdit(false); // Fermer le dialogue d'édition
        toast.current.show({ severity: 'success', summary: '', detail: 'Matériel mis à jour avec succès', life: 3000 });
        // Réinitialiser les valeurs des champs après la soumission réussie
        setDesignValueEdit('');
        setQteValueEdit('');
        setSelectedEtatEdit(null);
      })
      .catch((error) => {
        console.error('Error updating material:', error);
        toast.current.show({ severity: 'error', summary: '', detail: 'Impossible de mettre à jour le matériel', life: 3000 });
      });
  }
  const handleClearAddForm = () =>{
    setDesignValueAdd('')
      setQteValueAdd('')
      setSelectedEtatAdd('')
      setVisibleAdd(false)
  }
  const handleClearEditForm = () =>{
    setId('')
    setDesignValueEdit('')
      setQteValueEdit('')
      setSelectedEtatEdit('')
      setVisibleEdit(false)
  }
  const paginatorLeft = <Button type="button" icon="pi pi-refresh" text />;
  const paginatorRight = <Button type="button" icon="pi pi-download" text />;
  const fetchAllData = ()=>{
    axios
      .get('http://localhost:8000/api/material/')
      .then((response) => {
        setMaterials(response.data)
      })
      .catch((error) => {
        console.error(error)
      })
      axios
      .get('http://localhost:8000/api/material/stat')
      .then((response)=>{
        setStat(response.data)
      })
  }
  useEffect(() => {
    fetchAllData()
    toast.current.show({ severity: 'info', summary: '', detail: 'Bienvenue '+localStorage.getItem('account'), life: 3000 });
}, []);
const CheckState = (state) => {
  if (state === 'Bon')
    return 'success';
  if (state === 'Abimé')
    return 'warning';
  if (state === 'Mauvais')
    return 'danger';
  return 'info'; // Add a default state if none of the conditions match
};
const footer = (
  <div className="flex flex-wrap align-items-left justify-content-between gap-2 padding-4" style={{height:'50px',padding:'40px'}}>
      <span className="text-xl text-900 font-bold" > {materials ? materials.length : 0} materiel enregistrés</span><br />
      <Tag value={"Bon: "+stat[0]} severity={'success'}/>
      <Tag value={" Abimé: "+stat[1]} severity={'warning'} />
      <Tag value={" Mauvais: "+stat[2]} severity={'danger'}/>
  </div>
);
const header = (
  <div className="flex flex-wrap align-items-center justify-content-between gap-2">
      <span className="text-xl text-1100 font-bold">Projet 9: Gestion de materiel</span>
  </div>
);

  return (
    <>
    <Toast ref={toast} />
      <div className="card">
      <Button label="Logout" icon="pi pi-check" severity='secondary' loading={loading} onClick={load} style={{marginLeft:"1040px",marginBottom:50,marginTop:2}} />
        <Dialog className="modal" header="Add" visible={visibleAdd} style={{ width: '30vw' }} onHide={() => setVisibleAdd(false)}>
        <div style={{marginTop:"20px"}}>
          <span style={{marginTop:"20px"}} className="p-float-label">
          <InputText  id="design" value={designValueAdd} onChange={(e) => setDesignValueAdd(e.target.value)} />
            <label htmlFor="design">Désignation</label>
            </span>
            <TreeSelect style={{marginTop:"20px"}} value={selectedEtatAdd} onChange={(e) => setSelectedEtatAdd(e.value)} options={etatData} 
                className="md:w-20rem w-full" placeholder="Etat"></TreeSelect>
            <span style={{marginTop:"30px"}} className="p-float-label">
            <InputText id="qte" value={qteValueAdd} type='number' onChange={(e) => setQteValueAdd(e.target.value)} />
            <label htmlFor="qte">Quantité</label>
            </span>
            <span style={{marginTop:"20px"}} >
              
             <Button style={{marginTop:"20px",marginRight:"20px"}} onClick={handleClearAddForm} label="Annuler" severity='danger' />
              <Button style={{marginTop:"20px"}} onClick={handleAddSubmit} label="Ajouter" />
            </span>
        </div>
        </Dialog>

        <Dialog className="modal" header="Edit" visible={visibleEdit} style={{ width: '30vw' }} onHide={() => setVisibleEdit(false)}>
        <div style={{marginTop:"20px",display:'flex',flexDirection:'column',alignItems:'center'}}>
          <span style={{marginTop:"20px"}} className="p-float-label">
          <InputText  id="design" value={designValueEdit} onChange={(e) => setDesignValueEdit(e.target.value)} />
            <label htmlFor="design">Désignation</label>
            </span>
            <TreeSelect style={{marginTop:"20px" , width:"240px"}}  value={selectedEtatEdit} onChange={(e) => setSelectedEtatEdit(e.value)} options={etatData} 
                className="md:w-20rem w-full" placeholder="Etat"></TreeSelect>
            <span style={{marginTop:"30px"}} className="p-float-label">
            <InputText id="qte" value={qteValueEdit} type='number' onChange={(e) => setQteValueEdit(e.target.value)} />
            <label htmlFor="qte">Quantité</label>
            </span>
            <span style={{marginTop:"20px"}} >
              
             <Button style={{marginTop:"20px",marginRight:"20px"}} onClick={handleClearEditForm} label="Annuler" severity='danger' />
              <Button style={{marginTop:"20px"}} onClick={handleEditSubmit} label="Modifier" />
            </span>
        </div>
        </Dialog>
        <Toast ref={toast} />
        <ConfirmPopup />
            <DataTable value={materials} header={header}  paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} tableStyle={{ minWidth: '50rem' }}
                    paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                    currentPageReportTemplate="{first} to {last} of {totalRecords}" paginatorLeft={paginatorLeft} paginatorRight={paginatorRight}
                    footer={footer}>
                <Column field="numeroMaterial" header="Numero" style={{ width: '25%' }}></Column>
                <Column field="design" header="Désignation" style={{ width: '25%' }}></Column>
                <Column header="Etat" style={{ width: '25%' }} body= {rowData => (
                    <Tag value={rowData.etat} severity={CheckState(rowData.etat)} />
                  )}></Column>
                <Column field="quantite" header="Quantité" style={{ width: '25%' }}></Column>
                <Column  style={{ width: '25%' }} 
                body={rowData => (<Button severity='info' icon={editIcon} onClick={() => handleEditData(rowData)} />)}
                ></Column>
                 <Column  style={{ width: '25%' }} 
                 header={<Button severity='success' icon={addIcon} onClick={() => setVisibleAdd(true)} />
                }
                body={rowData =>  <Button onClick={(event) => confirm(event, rowData)} icon={deleteIcon} className="p-button-danger" />}
                ></Column>
            </DataTable>
        </div>
    </>
  )
}

export default Dashboard

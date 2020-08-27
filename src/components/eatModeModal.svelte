<script context="module">
    export function showDept(){
       new BSN.Modal('#deptModal', { backdrop: true }).show();
     }
 </script>
 <script>
     import { loggedIn,paidAmount, DepartmentId, returnHome, eatModal, returnDept, eatState } from '../stores.js';
     import { createEventDispatcher } from 'svelte';
     import { beforeUpdate, afterUpdate, onMount } from 'svelte';
     import router from "page"
 
     let myNewModalInstance
   
       let pin = '';
    
   
     const dispatch = createEventDispatcher();
     export let db;
     let departments = [];
 
     function select(DepartmentIdSet,DepartmentNameSet) {
       eatState.set(DepartmentNameSet);
       new BSN.Modal('#eatModal', { backdrop: true }).hide();
       if (DepartmentIdSet == 1)
       router('/'+'NoModal');
     }
     const clear  = () => pin = '';
 
     let loginPin = '';
     $: view = pin ? pin.replace(/\d(?!$)/g, '•') : 'enter your pin';
     $: {
       if ($eatModal === true) {
         myNewModalInstance.show();
         eatModal.set(false);
       }
 
     }
     onMount(async () => {
       //departments = await db.departments.toArray();
       let myOption = {};
       myOption.Name = "Eat In";
       myOption.Id = 1;
       departments.push(myOption);
       myOption = {};
       myOption.Name = "Eat out";
       myOption.Id = 2;
       departments.push(myOption);
       departments = departments;
       window.addEventListener('load', (event) => {
       myNewModalInstance = new BSN.Modal('#eatModal', { backdrop: true });
       });
       /*if ($returnDept ===  true) {
         returnDept.set(false);
         myNewModalInstance.show();
       }*/
     });
   
   
   
   </script>
   
   
   <style>
       
   
       button {
           margin: 0
       }
   </style>
   
   
   <!-- Modal -->
   <div class="modal fade" id="eatModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
     <div class="modal-dialog" role="document">
       <div class="modal-content">
         <div class="modal-header">
           <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
           <button type="button" class="close" data-dismiss="modal" aria-label="Close">
             <span aria-hidden="true">&times;</span>
           </button>
         </div>
         <div class="modal-body">
           <div><h1>{view}</h1></div>
           {#each departments as department}
             <button class="btn btn-primary" style="width:23%;margin-right:5px;margin-bottom:5px" on:click={select(department.Id,department.Name)}>{department.Name}</button>
           {/each}
           
          
         </div>
         <div class="modal-footer">
           <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
           <button type="button" class="btn btn-primary">Save changes</button>
         </div>
       </div>
     </div>
   </div>
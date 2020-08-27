<script context="module">

    import { loggedIn, currentTable, currentTicket, cartProducts, currentTableName, returnHome, returnDept} from '../stores.js';
  

 
    
    </script>
    <script>
    import { beforeUpdate, afterUpdate, onMount } from 'svelte';
    import Dexie from 'dexie';
    let myTagDisplay = [];
    let myGroups = [];
    let currGroups = {};
    let myNewModalInstance;
    export let db;
    import router from "page";
    afterUpdate(() => {
      var theseTabs = document.getElementById('myTabs');
      
      // let's give the initialization a JavaScript reference for the "target" option
      var myTabsCollection = theseTabs.getElementsByTagName('A');

      // initialize the component for all items in the collection
      Array.from(myTabsCollection).map(
      tab => new BSN.Tab( tab, {height: true} )
      );
    });    
        onMount(async () => {
       
         let db2 = await new Dexie("POS1").open();
        console.log("Version", db2.verno);
        console.log("Tables", db2.tables.map(({name, schema}) => ({
          name,
          schema
        })))
              window.db2 = db2;  
        let myTables = await db.tLayout.toArray();
        let myOrders = await db.orders.where('currentTable').notEqual(0).toArray();

        let k;
        let i;
       
        let uniqueLayouts = [];
        let uniqueTables = [];
        
        for (k in myTables) {
            if (uniqueLayouts.includes(myTables[k].esId) === false) {
                myGroups.push(myTables[k]);
                uniqueLayouts.push(myTables[k].esId);
            }
            if (uniqueTables.includes(myTables[k].eId) === false) {

                for (i in myOrders) {


                  if (myTables[k].eId == myOrders[i].currentTable) {
                    myTables[k].existing = myOrders[i].id;
                    myTables[k].cartTotal = myOrders[i].cartTotal;
  
                    break;
                  } else {
                    myTables[k].existing = 'a';
                  }

                }
                myTagDisplay.push(myTables[k]);
                uniqueTables.push(myTables[k].eId);

            }
            
        }
        myGroups = myGroups;
        myTagDisplay = myTagDisplay;
        console.log(myTagDisplay);
        });
        async function assignTable(thisTableName,thisTable,ticketId) {
          if (ticketId != 'a' && typeof ticketId != 'undefined') {
            currentTicket.set(ticketId);
            let getItems = await db.orders.where({id:ticketId}).first();
            cartProducts.set(getItems.items);
          }
          currentTable.set(thisTable);
          currentTableName.set(thisTableName);
          returnHome.set(true);
          returnDept.set(true);
          router('/');


        }
        function takeMeHome() {
          returnHome.set(true);
          router('/');
        }

    </script>
    <!-- Modal -->
   <div class="row" style="margin-top:100px;margin-left:180px">
            <ul class="nav nav-tabs" id="myTabs" role="tablist">
              {#each myGroups as cat,i}
                <li class="nav-item">
                  <a class="nav-link {i == '0' ? 'active' : ''}"  id="{cat.esId}" data-toggle="tab" href="#home-{cat.esId}" role="tab" aria-controls="home-{cat.esId}" aria-selected=" {i == '0' ? 'true' : 'false'}">{cat.eName}</a>
                </li>
                {/each}
            </ul>
              <div class="tab-content" id="myTabContent">
                {#each myGroups as cat,i}
                <div class="tab-pane fade {i == '0' ? 'active show' : ''}" id="home-{cat.esId}" role="tabpanel" aria-labelledby="{cat.esId}">
                  <div class="row">

                    {#each myTagDisplay as tags}
                        {#if tags.esId == cat.esId}
                        <li on:click="{assignTable(tags.Properties2,tags.eId,tags.existing)}" style="position:absolute;border: 3px solid black;top:{parseFloat(tags.YLocation) + 200}px;left:{parseFloat(tags.XLocation)+180}px;color:black">{tags.Properties2} - {tags.existing != 'a' && typeof tags.existing != 'undefined' ? tags.existing + ' ' + tags.cartTotal : ''}</li>
                        {/if}
                    {/each}
                  </div>
 
                </div>
                {/each}
            
              
              </div>
              <button  class="btn btn-primary" style="margin-right:5px"  on:click="{() => takeMeHome()}">TakeMeHome</button>

            </div>
    <style>
   
    </style>
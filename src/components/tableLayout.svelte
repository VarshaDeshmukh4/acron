    <script context="module">

    import { loggedIn, currentTable, currentTicket, cartProducts, currentTableName} from '../stores.js';
  

 
    
    </script>
    <script>
    import { beforeUpdate, afterUpdate, onMount } from 'svelte';

    export let db;
    let myTagDisplay = [];
    let myGroups = [];
    let currGroups = {};
    let myNewModalInstance;
    export let onCloseTable;
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
        myNewModalInstance = new BSN.Modal('#tableModal', { backdrop: true });
        myNewModalInstance.show();
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
          myNewModalInstance.dispose();
          onCloseTable();


        }

    </script>
    <!-- Modal -->
    <div class="modal fade" id="tableModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
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
                    {#each myTagDisplay as tags}
                        {#if tags.esId == cat.esId}
                        <li on:click="{assignTable(tags.Properties2,tags.eId,tags.existing)}" style="position:absolute;border: 3px solid black;top:{tags.YLocation}px;left:{tags.XLocation}px;color:black">{tags.Properties2} - {tags.existing != 'a' && typeof tags.existing != 'undefined' ? tags.existing + ' ' + tags.cartTotal : ''}</li>
                        {/if}
                    {/each}
                    
                </div>
                {/each}
            
              
              </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary">Save changes</button>
          </div>
        </div>
      </div>
    </div>

    <style>
        .modal-dialog {
        width: 100%;
        max-width: 100%;

        height: 100%;
        margin: 0;
        padding: 0;
        }

        .modal-content {
        height: auto;
        min-height: 100%;
        border-radius: 0;
        }
    </style>
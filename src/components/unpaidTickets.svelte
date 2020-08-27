<script context="module">

    import { loggedIn } from '../stores.js';
    import { cartProducts, currentTicket, currentTable, currentTableName } from '../stores.js';


 
    
    </script>
    <script>
    import { onMount } from 'svelte';
    export let db;
    let orders =[];

    onMount(async () => {
      var myNewModalInstance = new BSN.Modal('#unPaidModal', { backdrop: true }).show();
        orders = await db.orders.toArray();

        });
    async function getOrder(ticketId) {
        currentTicket.set(ticketId);
        let getItems = await db.orders.where({id:ticketId}).first();
        cartProducts.set(getItems.items);


    }
    
    </script>
    <!-- Modal -->
    <div class="modal fade" id="unPaidModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            {#each orders as tags,i}
            <li>ORDER # {tags.time} {tags.currentTable} <button on:click="{getOrder(tags.id)}">FIND ORDER</button></li>
          {/each}

              
              </div>
          </div>
        </div>
      </div>

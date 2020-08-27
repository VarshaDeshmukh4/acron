<script context="module">
export function showLoginUp() {
showLogin();

}
  </script>
<script>

        import Category from './category.svelte';
        import Products from './products.svelte';
        import PayModal from './payModal.svelte';
    
        
        import Cart, { saveOrderCart } from './cart.svelte';
        import Modifiers from './modifiers.svelte';
        import UnpaidTickets from './unpaidTickets.svelte';
        import TableLayout from './tableLayout.svelte';
        import LoginModal2, {showLogin} from './loginModal2.svelte';

        import Dexie from 'dexie';
      //  import { onMount } from 'svelte';
        let dataLoad = getInitialData();
        let showModifiers = false;
        let showUnpaid = false;
        let showTableLayout = false;
        let newTableVar = false;
        let currentPortion =0;
        let showPayModal = false;
        let showLoginModal = false;
        let departmentModal = false;
        let showFirst = 'department';
    
        import { currentTicket, currentTable, currentTableName, cartTotal, paidAmount,cartProducts, returnHome, DepartmentId, currentUser,showLoginModal2, eatModal, eatState, loginProcess,globalDepartmentModal, returnDept } from '../stores.js';
    
        function goToScreen(nextScreen, fromStart = false) {
      switch (nextScreen) {
        case "eatModal":
          eatModal.set(true);
          break;
        case "departmentModal":
           globalDepartmentModal.set(true);
          break;

        }



       }
       window.goToScreen = goToScreen;
       $: console.log('login' + $loginProcess);

     
    
        async function getInitialData() {
            
          if ($returnHome === true) {
            let myData = await db.departments.orderBy('id').toArray();
           //   alert(setDept);
           if ($DepartmentId ==0)
             DepartmentId.set(myData[1].Id);
              showLoginModal=true;
              departmentModal = true;
              let nextScreen = $loginProcess.shift();
              loginProcess.set($loginProcess);
              goToScreen(nextScreen,true);
               // returnHome.set(false);
                return true;
            }

            const res = await fetch(`https://chi2.f4food.net/home2/getMapingCategoryByDept2`);
            let category = await res.json();
            const productsJson = await fetch(`https://chi2.f4food.net/home2/getProducts4`);
            let products = await productsJson.json();
            const tagJson = await fetch(`https://chi2.f4food.net/home2/getOrderTagsAll`);
            let tags = await tagJson.json();
            const tLayoutJson = await fetch(`https://chi2.f4food.net/home2/getKitchen`);
            let tLayoutJSON2 = await tLayoutJson.json();
            const getUserJSON = await fetch(`https://chi2.f4food.net/home2/getUsers`);
            let getUsers = await getUserJSON.json();
           
            await db.category.clear();		
            await db.products.clear();
            await db.tags.clear();
            await db.tLayout.clear();
            await db.departments.clear();

            await db.category.bulkAdd(category);
            await db.products.bulkAdd(products);
            await db.tags.bulkAdd(tags);
            await db.tLayout.bulkAdd(tLayoutJSON2.kitchen);
            await db.departments.bulkAdd(tLayoutJSON2.departments);

            await db.users.bulkAdd(getUsers);
            if ($DepartmentId ==0)
            DepartmentId.set(tLayoutJSON2.departments[1].Id);
            if (showFirst != 'department')
                showLoginModal=true;
            else {
              showLogin(); 
              departmentModal = true;

            }

            
    
    
    
        }
        async function saveOrder() {
          loginProcess.set(['eatModal','departmentModal']);
          showLogin();
            if ($cartProducts.length == 0) {
                alert('Nothing to save');
                if ($currentTicket != 0) {
                    await db.orders.delete($currentTicket);
                }
                return false;
    
            }
            if ($currentTicket == 0) {
                var currentdate = new Date(); 
                var datetime = "Last Sync: " + currentdate.getDate() + "/"
                    + (currentdate.getMonth()+1)  + "/" 
                    + currentdate.getFullYear() + " @ "  
                    + currentdate.getHours() + ":"  
                    + currentdate.getMinutes() + ":" 
                    + currentdate.getSeconds();
                let currentOrder = await db.orders.add({items:$cartProducts,time:datetime,currentTable:$currentTable,currentTableName:$currentTableName,cartTotal:$cartTotal});
            }
            else {
                if ($cartProducts.length != 0) {
                    let currentOrder = await db.orders.update($currentTicket,{items:$cartProducts,currentTable:$currentTable,currentTableName:$currentTableName,cartTotal:$cartTotal});
                }
                else
                    await db.orders.delete($currentTicket);
    
            }
            cartProducts.set([]);
            currentTicket.set(0);
            currentTable.set(0);
            currentTableName.set('');
            paidAmount.set(0);
    
        }
        let currentItem;
        async function handleCart(event) {     
            showModifiers = !showModifiers;
            currentPortion = event.detail.item.GroupCode;
            currentItem = event.detail;
    
        }
        function handleStateModal() {
            alert('true');
        }
        //$: alert(showModifiers);
        window.saveOrder = saveOrder;
    
        
    
    </script>
    

    
        <main role="main" class="container" style="max-width:96%;height:80vh;overflow-y:scroll;margin-top: 78px;">
    
          
          {#await dataLoad}
          WAITINGWAITINGWAITINGWAITING
          {:then number}
           <div class="container" style="max-width:100%" >
            <div class="row" style="margin-bottom:20px">

            <button class="btn btn-primary" style="margin-right:5px" on:click="{() => showModifiers = !showModifiers}">MountModifiers</button>
            <button class="btn btn-primary" style="margin-right:5px" on:click="{() => showUnpaid = !showUnpaid}">mountUnpaid</button>
            <button class="btn btn-primary" style="margin-right:5px" on:click="{() => showTableLayout = !showTableLayout}">mountTable</button>
            <button class="btn btn-primary" style="margin-right:5px" on:click="{() => showPayModal = !showPayModal}">MountPay</button>
            <button  class="btn btn-primary" style="margin-right:5px"  on:click="{() => Window.closeWAPP()}">CLOSEAPP</button>
            <a href="/about">Read</a>
            <a href="/NoModal">NoModal</a>
            <a href="/Table/1">Table</a>
            
            </div>

            <div class="row">
                 <div class="col-sm-2" style="padding:0px">
                <Category db={db} />
                </div>
              <div class="col-sm-5">
                <Products db={db} />
              </div>
              <div class="col-sm-5" style="padding:0px">
                <h5 class="modal-title" id="exampleModalLabel">
                    Your Shopping Cart
                  </h5>
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                  <button type="button" class="close" on:click="{saveOrder}">
                    <span aria-hidden="true">SAVE</span>
                  </button>
                  <table class="table table-image">
                    <thead>
                      <tr>
                        <th scope="col"></th>
                        <th scope="col">Product</th>
                        <th scope="col">Price</th>
                        <th scope="col">Qty</th>
                        <th scope="col">Total</th>
                        <th scope="col">Actions</th>
                      </tr>
                    </thead>
                <Cart on:message={handleCart} db={db} />
                  </table> 
                  <div class="d-flex justify-content-end">
                    <h5>Total: <span class="price text-success">{parseFloat($cartTotal - $paidAmount).toFixed(2)}</span></h5>
                  </div>
            </div>
          </div>
          </div>
          {:catch error}
        <p style="color: red">{JSON.stringify(error.message)}</p>
          {/await}
        </main><!-- /.container -->
    {#if showModifiers}
        <Modifiers onClose={() => showModifiers = false} currentItem={currentItem.index} currentModifiers={currentItem} db={db} currentPortion={currentPortion} myId={3736}/>
    {/if}
    {#if showUnpaid}
        <UnpaidTickets db={db} />
    {/if}
    {#if showTableLayout}
        <TableLayout onCloseTable={() => showTableLayout = false}  db={db} />
    {/if}
    {#if showPayModal}
        <PayModal onCloseTable={() => showPayModal = false}  db={db} />
    {/if}
        <LoginModal2 onCloseLogin={() => showLoginModal = false}  db={db} />
    {#if departmentModal}
    {/if}

    
    <style>
    body {
      padding-top: 5rem;
    }
    
    main {
        margin-left: 50px;
    }
    </style>
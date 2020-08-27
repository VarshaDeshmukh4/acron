<script context="module">
export function showLogin() {
  let myNewModalInstance = new BSN.Modal('#loginModal', { backdrop: true });
  console.log(myNewModalInstance)

      myNewModalInstance.show();
    }



</script>

<script>
    import { loggedIn,paidAmount, currentUser, showLoginModal2,globalDepartmentModal,loginProcess,eatModal } from '../stores.js';
    import { createEventDispatcher } from 'svelte';
    import { beforeUpdate, afterUpdate, onMount } from 'svelte';
  
  
      let pin = '';
  
    const dispatch = createEventDispatcher();
    export let onCloseTable;
    export let db;
  
    const select = num => () => pin += num;
    const clear  = () => pin = '';
    const submit  = () => pin = '';

    async function submit1() {
     // paidAmount.set(pin);
      let myUser = await db.users.where("PinCode").equals(pin).first();
      if (typeof myUser !== 'undefined') {
        currentUser.set(myUser);
        loggedIn.set(true);
        new BSN.Modal('#loginModal', { backdrop: true }).hide();
        let nextScreen = $loginProcess.shift();
        loginProcess.set($loginProcess);
        goToScreen(nextScreen);
      } else {
          alert('aiaiaiai alpha')
      }
    }
    let loginPin = '';
    $: view = pin ? pin.replace(/\d(?!$)/g, '•') : 'enter your pin';
    onMount(async () => {

    });
  
  
  
  </script>
  
  
  <style>
      .keypad {
          display: grid;
          grid-template-columns: repeat(3, 5em);
          grid-template-rows: repeat(4, 3em);
          grid-gap: 0.5em
      }
  
      button {
          margin: 0
      }
  </style>
  
  
  <!-- Modal -->
  <div class="modal fade" id="loginModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
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
  
          <div class="keypad">
            <button on:click={select(1)}>1</button>
            <button on:click={select(2)}>2</button>
            <button on:click={select(3)}>3</button>
            <button on:click={select(4)}>4</button>
            <button on:click={select(5)}>5</button>
            <button on:click={select(6)}>6</button>
            <button on:click={select(7)}>7</button>
            <button on:click={select(8)}>8</button>
            <button on:click={select(9)}>9</button>
          
            <button disabled={!pin} on:click={clear}>clear</button>
            <button on:click={select(0)}>0</button>
            <button disabled={!pin} on:click={submit1}>submit</button>
          </div>
  <!-- for better usage, wrap the tabs and contents -->
  
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary">Save changes</button>
        </div>
      </div>
    </div>
  </div>